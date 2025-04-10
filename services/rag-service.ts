import { generateEmbeddings, generateText, AIMessage } from './ai-service';

// Types for RAG service
export interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface SearchResult {
  document: Document;
  score: number;
}

// Simple in-memory vector store for documents
class VectorStore {
  private documents: Document[] = [];

  // Add a document to the store
  async addDocument(content: string, metadata: Record<string, any> = {}): Promise<Document> {
    try {
      const embedding = await generateEmbeddings(content);
      const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const document: Document = {
        id,
        content,
        metadata,
        embedding
      };
      
      this.documents.push(document);
      return document;
    } catch (error) {
      console.error('Error adding document to vector store:', error);
      throw error;
    }
  }

  // Search for documents similar to the query
  async search(query: string, limit: number = 5): Promise<SearchResult[]> {
    try {
      if (this.documents.length === 0) {
        return [];
      }
      
      const queryEmbedding = await generateEmbeddings(query);
      
      // Calculate cosine similarity between query and documents
      const results = this.documents
        .map(doc => {
          if (!doc.embedding) {
            return { document: doc, score: 0 };
          }
          
          // Cosine similarity
          const dotProduct = queryEmbedding.reduce((sum, val, i) => sum + val * (doc.embedding?.[i] || 0), 0);
          const queryMagnitude = Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0));
          const docMagnitude = Math.sqrt(doc.embedding.reduce((sum, val) => sum + val * val, 0));
          
          const similarity = dotProduct / (queryMagnitude * docMagnitude);
          
          return {
            document: doc,
            score: similarity
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      
      return results;
    } catch (error) {
      console.error('Error searching vector store:', error);
      throw error;
    }
  }

  // Get all documents
  getDocuments(): Document[] {
    return this.documents;
  }

  // Delete a document
  deleteDocument(id: string): boolean {
    const initialLength = this.documents.length;
    this.documents = this.documents.filter(doc => doc.id !== id);
    return this.documents.length < initialLength;
  }

  // Clear all documents
  clear(): void {
    this.documents = [];
  }
}

// Create a singleton instance of the vector store
export const vectorStore = new VectorStore();

// Function to add a document to the knowledge base
export async function addToKnowledgeBase(content: string, metadata: Record<string, any> = {}): Promise<Document> {
  return await vectorStore.addDocument(content, metadata);
}

// Function to search the knowledge base
export async function searchKnowledgeBase(query: string, limit: number = 5): Promise<SearchResult[]> {
  return await vectorStore.search(query, limit);
}

// Function to generate a response using RAG
export async function generateRAGResponse(query: string, systemPrompt: string = ''): Promise<string> {
  try {
    // Search for relevant documents
    const searchResults = await searchKnowledgeBase(query);
    
    // Extract content from search results
    const relevantContent = searchResults
      .map(result => result.document.content)
      .join('\n\n');
    
    // Create messages for the AI
    const messages: AIMessage[] = [];
    
    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    // Add context from relevant documents
    messages.push({
      role: 'system',
      content: `Here is some relevant information that might help you answer the user's question:\n\n${relevantContent}`
    });
    
    // Add user query
    messages.push({
      role: 'user',
      content: query
    });
    
    // Generate response
    const response = await generateText(messages);
    
    return response.text;
  } catch (error) {
    console.error('Error generating RAG response:', error);
    throw error;
  }
}

// Function to process and add a file to the knowledge base
export async function processFile(file: File): Promise<Document[]> {
  try {
    const text = await readFileAsText(file);
    
    // Split text into chunks (simple approach - in a real app, you'd use a more sophisticated chunking strategy)
    const chunks = splitTextIntoChunks(text, 1000);
    
    // Add each chunk as a separate document
    const documents: Document[] = [];
    
    for (const chunk of chunks) {
      const document = await addToKnowledgeBase(chunk, {
        source: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      documents.push(document);
    }
    
    return documents;
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
}

// Helper function to read a file as text
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

// Helper function to split text into chunks
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  
  // Split by paragraphs first
  const paragraphs = text.split(/\n\s*\n/);
  
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the chunk size, start a new chunk
    if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
    
    currentChunk += paragraph + '\n\n';
  }
  
  // Add the last chunk if it's not empty
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}
