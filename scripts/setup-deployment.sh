#!/bin/bash

# S3 + CloudFront Deployment Setup Script
# This script helps configure the deployment environment

echo "🚀 Setting up S3 + CloudFront deployment for USA Full-Stack Application"

# Check if required tools are installed
echo "📋 Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Test build locally
echo "🔨 Testing local build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful"
    echo "📁 Build output directory: out/"
    echo "📊 Build output size:"
    du -sh out/
else
    echo "❌ Local build failed. Please fix build issues before deployment."
    exit 1
fi

# Display configuration information
echo ""
echo "📋 Deployment Configuration Summary:"
echo "====================================="
echo "• Next.js Config: output='export', trailingSlash=true"
echo "• Build Output: out/ directory"
echo "• GitHub Actions: .github/workflows/deploy.yml"
echo "• AWS Region: us-east-2 (configurable)"
echo "• S3 Bucket: usa-fullstack-app (configurable)"
echo ""

echo "🔧 Next Steps:"
echo "1. Create S3 bucket: usa-fullstack-app"
echo "2. Create CloudFront distribution pointing to S3 bucket"
echo "3. Create IAM role: github-actions-deploy-s3-cloudfront"
echo "4. Configure GitHub repository secrets:"
echo "   - AWS_REGION"
echo "   - S3_BUCKET"
echo "   - CF_DIST_ID"
echo "5. Update workflow file with your AWS account ID"
echo "6. Push to main branch to trigger deployment"
echo ""

echo "📚 For detailed instructions, see: public/library/project-specs/s3-cloudfront-deployment.md"
echo "🔐 For IAM policies, see: aws-iam-policy.json and aws-trust-policy.json"
echo ""

echo "🎉 Setup complete! Ready for deployment."
