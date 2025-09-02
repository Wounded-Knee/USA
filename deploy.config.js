module.exports = {
  aws: {
    region: 'us-east-1',
    s3: {
      bucket: 'whitepine',
      // S3 bucket configuration
      website: {
        indexDocument: 'index.html',
        errorDocument: '404.html'
      }
    },
    cloudfront: {
      distributionId: 'E224EA6ZP3GGQH',
      // CloudFront invalidation paths
      invalidationPaths: ['/*']
    }
  },
  build: {
    outputDir: 'out',
    // Build output directory (Next.js static export)
    excludeFromCache: ['*.html'],
    // Files that should not be cached
    cacheControl: {
      static: 'public,max-age=31536000,immutable',
      html: 'no-cache'
    }
  },
  deployment: {
    // Deployment strategy
    strategy: 'sync-and-invalidate',
    // Sync S3, then invalidate CloudFront
    cleanup: true,
    // Remove old files from S3
    dryRun: false
    // Set to true for testing without actual deployment
  }
};
