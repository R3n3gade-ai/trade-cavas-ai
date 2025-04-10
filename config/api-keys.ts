// API keys for external services
// These should be loaded from environment variables in production

export const VERTEX_AI_API_KEY = import.meta.env.VITE_VERTEX_AI_API_KEY || '';
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY || '';

// API endpoints
export const VERTEX_AI_ENDPOINT = import.meta.env.VITE_VERTEX_AI_ENDPOINT || 'https://us-central1-aiplatform.googleapis.com/v1/projects/your-project-id/locations/us-central1/publishers/google/models/gemini-pro:generateContent';
export const GEMINI_ENDPOINT = import.meta.env.VITE_GEMINI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Check if API keys are available
export const isVertexAIConfigured = !!VERTEX_AI_API_KEY;
export const isGeminiConfigured = !!GEMINI_API_KEY;

// Default to use Gemini if Vertex AI is not configured
export const useVertexAI = isVertexAIConfigured;
