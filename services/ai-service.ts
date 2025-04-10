import { VERTEX_AI_API_KEY, GEMINI_API_KEY, VERTEX_AI_ENDPOINT, GEMINI_ENDPOINT, useVertexAI } from '../config/api-keys';

// Types for AI service
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIError {
  message: string;
  code?: string;
}

// Function to generate text using Vertex AI
async function generateWithVertexAI(messages: AIMessage[]): Promise<AIResponse> {
  try {
    const response = await fetch(VERTEX_AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VERTEX_AI_API_KEY}`
      },
      body: JSON.stringify({
        contents: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate text with Vertex AI');
    }

    const data = await response.json();
    return {
      text: data.candidates[0].content.parts[0].text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: (data.usageMetadata?.promptTokenCount || 0) + (data.usageMetadata?.candidatesTokenCount || 0)
      }
    };
  } catch (error) {
    console.error('Error generating text with Vertex AI:', error);
    throw error;
  }
}

// Function to generate text using Gemini
async function generateWithGemini(messages: AIMessage[]): Promise<AIResponse> {
  try {
    // Convert messages to Gemini format
    const prompt = messages.map(msg => {
      if (msg.role === 'system') {
        return `Instructions: ${msg.content}\n\n`;
      } else if (msg.role === 'user') {
        return `User: ${msg.content}\n\n`;
      } else {
        return `Assistant: ${msg.content}\n\n`;
      }
    }).join('');

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate text with Gemini');
    }

    const data = await response.json();
    return {
      text: data.candidates[0].content.parts[0].text,
      // Gemini doesn't provide token usage in the same way
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      }
    };
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw error;
  }
}

// Function to generate text using the configured AI service
export async function generateText(messages: AIMessage[]): Promise<AIResponse> {
  try {
    if (useVertexAI) {
      return await generateWithVertexAI(messages);
    } else {
      return await generateWithGemini(messages);
    }
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

// Function to generate embeddings for RAG
export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    // Use Vertex AI for embeddings if configured
    if (useVertexAI) {
      const response = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/your-project-id/locations/us-central1/publishers/google/models/textembedding-gecko:predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VERTEX_AI_API_KEY}`
        },
        body: JSON.stringify({
          instances: [{ content: text }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate embeddings');
      }

      const data = await response.json();
      return data.predictions[0].embeddings.values;
    } else {
      // For Gemini, we'll use a simpler approach since it doesn't have a dedicated embeddings API
      // This is a placeholder - in a real app, you'd use a proper embeddings API
      return Array(512).fill(0).map(() => Math.random() - 0.5);
    }
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

// Function to analyze an image using Vertex AI Vision
export async function analyzeImage(imageBase64: string): Promise<string> {
  try {
    if (useVertexAI) {
      const response = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/your-project-id/locations/us-central1/publishers/google/models/imagetext:predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VERTEX_AI_API_KEY}`
        },
        body: JSON.stringify({
          instances: [
            {
              image: {
                bytesBase64Encoded: imageBase64
              }
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      return data.predictions[0].text;
    } else {
      // For Gemini, use the multimodal capabilities
      const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Describe this image in detail:" },
                { 
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBase64
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image with Gemini');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}
