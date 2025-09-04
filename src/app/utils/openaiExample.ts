import { 
  executeOpenAIQuery, 
  getOpenAIResponse, 
  executeOpenAIQueryStream,
  formatTokens,
  estimateCost 
} from './openaiUtils';

/**
 * Example usage of the OpenAI utility functions
 * This file demonstrates various ways to interact with the OpenAI API
 */

// Example 1: Basic query execution
export async function basicQueryExample() {
  try {
    const response = await executeOpenAIQuery(
      "What is the capital of California?",
      "You are a helpful geography assistant."
    );
    
    console.log('Full Response:', response);
    console.log('Answer:', response.choices[0].message.content);
    console.log('Tokens used:', formatTokens(response.usage.total_tokens));
    console.log('Estimated cost:', estimateCost(
      response.usage.prompt_tokens,
      response.usage.completion_tokens,
      response.model
    ));
    
    return response;
  } catch (error) {
    console.error('Error in basic query:', error);
    throw error;
  }
}

// Example 2: Simple response extraction
export async function simpleResponseExample() {
  try {
    const answer = await getOpenAIResponse(
      "Explain democracy in one sentence.",
      "You are a political science expert."
    );
    
    console.log('Simple Answer:', answer);
    return answer;
  } catch (error) {
    console.error('Error in simple response:', error);
    throw error;
  }
}

// Example 3: Custom configuration
export async function customConfigExample() {
  try {
    const response = await executeOpenAIQuery(
      "Write a short poem about technology",
      "You are a creative poet who writes concise, meaningful poems.",
      {
        model: 'gpt-4',
        temperature: 0.9,
        max_tokens: 150,
        frequency_penalty: 0.5
      }
    );
    
    console.log('Creative Response:', response.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('Error in custom config:', error);
    throw error;
  }
}

// Example 4: Streaming response
export async function streamingExample() {
  try {
    let fullResponse = '';
    
    await executeOpenAIQueryStream(
      "Tell me a story about a brave explorer",
      "You are a master storyteller who creates engaging narratives.",
      { max_tokens: 300 },
      (chunk) => {
        fullResponse += chunk;
        process.stdout.write(chunk); // Print chunks as they arrive
      }
    );
    
    console.log('\n\nFull story:', fullResponse);
    return fullResponse;
  } catch (error) {
    console.error('Error in streaming:', error);
    throw error;
  }
}

// Example 5: Conversation with context
export async function conversationExample() {
  try {
    const messages = [
      { role: 'system' as const, content: 'You are a helpful assistant.' },
      { role: 'user' as const, content: 'Hello! How are you today?' },
      { role: 'assistant' as const, content: 'Hello! I\'m doing well, thank you for asking. How can I help you today?' },
      { role: 'user' as const, content: 'Can you help me understand how democracy works?' }
    ];
    
    const response = await executeOpenAIQuery(
      "Can you help me understand how democracy works?",
      "You are a helpful assistant.",
      { messages }
    );
    
    console.log('Conversation Response:', response.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('Error in conversation:', error);
    throw error;
  }
}

// Example 6: Error handling demonstration
export async function errorHandlingExample() {
  try {
    // This will fail if OPENAI_API_KEY is not set
    const response = await executeOpenAIQuery("Test query");
    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        console.error('Configuration Error: Please set your OpenAI API key');
      } else if (error.message.includes('OpenAI API Error')) {
        console.error('API Error:', error.message);
      } else if (error.message.includes('Network Error')) {
        console.error('Network Error:', error.message);
      } else {
        console.error('Unexpected Error:', error.message);
      }
    }
    throw error;
  }
}

// Example 7: Batch processing multiple queries
export async function batchProcessingExample(queries: string[]) {
  try {
    const results = await Promise.all(
      queries.map(query => 
        getOpenAIResponse(query, "You are a helpful assistant.")
      )
    );
    
    console.log('Batch Results:', results);
    return results;
  } catch (error) {
    console.error('Error in batch processing:', error);
    throw error;
  }
}

// Example 8: Cost estimation for multiple requests
export async function costEstimationExample() {
  try {
    const queries = [
      "What is democracy?",
      "Explain the electoral college",
      "How do political parties work?"
    ];
    
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    
    for (const query of queries) {
      const response = await executeOpenAIQuery(query);
      totalPromptTokens += response.usage.prompt_tokens;
      totalCompletionTokens += response.usage.completion_tokens;
    }
    
    const estimatedCost = estimateCost(totalPromptTokens, totalCompletionTokens);
    console.log(`Total tokens: ${formatTokens(totalPromptTokens + totalCompletionTokens)}`);
    console.log(`Estimated cost: $${estimatedCost.toFixed(4)}`);
    
    return { totalPromptTokens, totalCompletionTokens, estimatedCost };
  } catch (error) {
    console.error('Error in cost estimation:', error);
    throw error;
  }
}
