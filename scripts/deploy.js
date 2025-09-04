#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load deployment configuration
const config = require('../deploy.config.js');

function log(message) {
  console.log(`[DEPLOY] ${message}`);
}

function runCommand(command, description) {
  log(description);
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✓ ${description} completed`);
  } catch (error) {
    log(`✗ ${description} failed: ${error.message}`);
    process.exit(1);
  }
}

function checkPrerequisites() {
  log('Checking prerequisites...');
  
  // Check if AWS CLI is installed
  try {
    execSync('aws --version', { stdio: 'pipe' });
  } catch (error) {
    log('✗ AWS CLI not found. Please install AWS CLI first.');
    process.exit(1);
  }
  
  // Check if build output exists
  const buildDir = path.join(process.cwd(), config.build.outputDir);
  if (!fs.existsSync(buildDir)) {
    log('✗ Build output not found. Please run "npm run build" first.');
    process.exit(1);
  }
  
  log('✓ Prerequisites check passed');
}

function deployToS3() {
  log('Deploying to S3...');
  
  const bucket = config.aws.s3.bucket;
  const region = config.aws.region;
  const buildDir = config.build.outputDir;
  
  // Sync static assets with long cache
  const syncCommand = `aws s3 sync ${buildDir} s3://${bucket}/ --delete --exclude "*.html" --cache-control "${config.build.cacheControl.static}" --region ${region}`;
  runCommand(syncCommand, 'Syncing static assets to S3');
  
  // Upload HTML files with no-cache
  const htmlFiles = findHtmlFiles(buildDir);
  htmlFiles.forEach(file => {
    const key = path.relative(buildDir, file);
    const uploadCommand = `aws s3 cp "${file}" "s3://${bucket}/${key}" --cache-control "${config.build.cacheControl.html}" --content-type "text/html; charset=utf-8" --region ${region}`;
    runCommand(uploadCommand, `Uploading ${key}`);
  });
  
  log('✓ S3 deployment completed');
}

function findHtmlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  });
  
  return files;
}

function invalidateCloudFront() {
  log('Invalidating CloudFront...');
  
  const distributionId = config.aws.cloudfront.distributionId;
  const region = config.aws.region;
  
  const invalidationCommand = `aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "${config.aws.cloudfront.invalidationPaths.join(' ')}" --region ${region}`;
  runCommand(invalidationCommand, 'Creating CloudFront invalidation');
  
  log('✓ CloudFront invalidation completed');
}

function main() {
  log('Starting deployment process...');
  
  if (config.deployment.dryRun) {
    log('DRY RUN MODE - No actual deployment will occur');
  }
  
  checkPrerequisites();
  
  if (!config.deployment.dryRun) {
    deployToS3();
    invalidateCloudFront();
  }
  
  log('Deployment process completed successfully!');
}

if (require.main === module) {
  main();
}

module.exports = { deployToS3, invalidateCloudFront, checkPrerequisites };
