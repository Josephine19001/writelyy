import { generateText as generateTextAI } from '@repo/ai';
import { textModel } from '@repo/ai';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface GenerateTextParams {
  prompt: string;
  maxTokens?: number;
}

interface GenerateTextResponse {
  text: string;
}

/**
 * Generate text using OpenAI primary, Groq fallback
 */
export async function generateText({ prompt, maxTokens = 1000 }: GenerateTextParams): Promise<GenerateTextResponse> {
  try {
    // Try OpenAI first
    const response = await generateTextAI({
      model: textModel,
      prompt,
      maxTokens
    });
    
    return { text: response.text };
  } catch (openaiError) {
    console.warn('OpenAI failed, falling back to Groq:', openaiError);
    
    try {
      // Fallback to Groq
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile', // Fast, high-quality model
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content || '';
      return { text };
    } catch (groqError) {
      console.error('Both OpenAI and Groq failed:', { openaiError, groqError });
      throw new Error('Both AI services are currently unavailable. Please try again later.');
    }
  }
}

/**
 * Health check for AI services
 */
export async function checkAIHealth(): Promise<{ openai: boolean; groq: boolean }> {
  const results = {
    openai: false,
    groq: false
  };

  // Test OpenAI
  try {
    await generateTextAI({
      model: textModel,
      prompt: 'Test',
      maxTokens: 5
    });
    results.openai = true;
  } catch {
    // OpenAI failed
  }

  // Test Groq
  try {
    await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Test' }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 5,
    });
    results.groq = true;
  } catch {
    // Groq failed
  }

  return results;
}