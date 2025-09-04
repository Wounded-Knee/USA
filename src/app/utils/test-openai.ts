#!/usr/bin/env node

/**
 * Test script for OpenAI utility functions
 * Run with: npx tsx src/app/utils/test-openai.ts
 * 
 * Note: Requires OPENAI_API_KEY environment variable to be set
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { 
  executeOpenAIQuery, 
  getOpenAIResponse,
  formatTokens,
  estimateCost,
  getRateLimitStatus 
} from './openaiUtils';

function showPrompts() {
  console.log('🧪 OpenAI Utility - Prompt Preview Mode\n');
  console.log('💰 Using gpt-3.5-turbo-0125 (cheapest model: $0.50/$1.50 per 1M tokens)\n');
  console.log('🚫 FREE Tier Limits: 3 requests/minute, 200 requests/day, 40k tokens/day\n');
  
  // Debug: Check if API key is loaded
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    console.log('🔑 API Key loaded successfully');
    console.log(`🔑 Key starts with: ${apiKey.substring(0, 20)}...`);
  } else {
    console.log('❌ No API key found in environment');
  }
  
  // Show current rate limit status
  const rateLimitStatus = getRateLimitStatus();
  console.log('📊 Rate Limit Status:');
  console.log(`   Minute: ${rateLimitStatus.currentMinute.requests}/${rateLimitStatus.currentMinute.limit} (${rateLimitStatus.currentMinute.remaining} remaining)`);
  console.log(`   Day: ${rateLimitStatus.currentDay.requests}/${rateLimitStatus.currentDay.limit} (${rateLimitStatus.currentDay.remaining} remaining)`);
  console.log('');
  
  console.log('📝 PROMPT PREVIEWS (No API calls will be made):\n');
  
  // Test 1: Basic query execution
  console.log('1️⃣ Basic Query Execution:');
  console.log('   System Prompt: "You are a political science expert who gives concise answers."');
  console.log('   User Query: "What is democracy in one sentence?"');
  console.log('   Model: gpt-3.5-turbo-0125');
  console.log('   Max Tokens: 500');
  console.log('   Temperature: 0.7');
  console.log('');
  
  // Test 2: Simple response function
  console.log('2️⃣ Simple Response Function:');
  console.log('   System Prompt: "You are a geography expert."');
  console.log('   User Query: "What is the capital of California?"');
  console.log('   Model: gpt-3.5-turbo-0125');
  console.log('   Max Tokens: 500');
  console.log('   Temperature: 0.7');
  console.log('');
  
  // Test 3: Custom configuration
  console.log('3️⃣ Custom Configuration:');
  console.log('   System Prompt: "You are a creative poet."');
  console.log('   User Query: "Write a haiku about technology"');
  console.log('   Model: gpt-3.5-turbo-0125');
  console.log('   Max Tokens: 100');
  console.log('   Temperature: 0.9');
  console.log('   Frequency Penalty: 0.5');
  console.log('');
  
  console.log('📋 Expected API Request Structure:');
  console.log('   Endpoint: https://api.openai.com/v1/chat/completions');
  console.log('   Method: POST');
  console.log('   Headers: Authorization: Bearer [API_KEY], Content-Type: application/json');
  console.log('   Timeout: 30 seconds');
  console.log('');
  
  console.log('🔒 Rate Limiting:');
  console.log('   - Per-minute limit: 3 requests');
  console.log('   - Per-day limit: 200 requests');
  console.log('   - Automatic enforcement before API calls');
  console.log('   - Graceful error messages with wait times');
  console.log('');
  
  console.log('💡 Usage Tips:');
  console.log('   - Keep prompts concise to minimize token usage');
  console.log('   - Use system prompts to set context and tone');
  console.log('   - Monitor rate limits with getRateLimitStatus()');
  console.log('   - Handle errors gracefully in production code');
  console.log('');
  
  console.log('✨ Prompt preview complete. No API calls were made.');
}

// Run prompt preview if this file is executed directly
if (require.main === module) {
  showPrompts();
}

export { showPrompts };
