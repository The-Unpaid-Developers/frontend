import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.config";

const API_BASE_URL = buildApiUrl(
  API_CONFIG.CORE_SERVICE_URL,
  "/api/v1/queries"
);

const API_BASE_URL_AI = buildApiUrl(
  API_CONFIG.CORE_SERVICE_URL,
  "/api/v1/ai"
);

export const getAllQueriesAPI = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};

export const getSpecificQueryAPI = async (queryName: string) => {
  const response = await axios.get(`${API_BASE_URL}/${queryName}`);
  return response.data;
};

export const executeQueryAPI = async (queryName: string, payload: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/${queryName}/execute`,
    payload
  );
  return response.data;
};

export const createQueryAPI = async (queryData: any) => {
  const response = await axios.post(`${API_BASE_URL}`, queryData);
  return response.data;
};

export const updateQueryAPI = async (queryName: string, queryData: any) => {
  const response = await axios.put(`${API_BASE_URL}/${queryName}`, queryData);
  return response.data;
};

export const deleteQueryAPI = async (queryName: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${queryName}`);
  return response.data;
};

export const generateQueryAPI = async (data: any) => {
  const response = await axios.post(
    `${API_BASE_URL_AI}/generate-query`,
    data
  );
  return response.data;
};

export const generateQueryStreamAPI = async (
  data: any,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  try {
    const response = await fetch(`${API_BASE_URL_AI}/generate-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let buffer = '';

    const processMessage = (message: string) => {
      // SSE messages can have multiple lines like:
      // data: content1
      // data: content2
      // (blank line)

      const lines = message.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data:')) {
          // Handle both "data: " and "data:" formats
          const content = line.startsWith('data: ')
            ? line.slice(6)
            : line.slice(5);

          const trimmedContent = content.trim();

          // Skip empty data or done signals
          if (!trimmedContent || trimmedContent === '[DONE]') {
            continue;
          }

          // Spring's SseEmitter may JSON-encode strings, so we need to parse
          let finalContent = trimmedContent;
          try {
            // If it's a JSON string (wrapped in quotes), parse it
            const parsed = JSON.parse(trimmedContent);
            if (typeof parsed === 'string') {
              finalContent = parsed;
            }
          } catch (e) {
            // Not JSON or parse failed, use as-is
          }

          onChunk(finalContent);
        }
      }
    };

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Process any remaining data in buffer
        if (buffer.trim()) {
          processMessage(buffer);
        }
        onComplete();
        break;
      }

      // Decode and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // SSE messages are delimited by \n\n (double newline)
      const messages = buffer.split('\n\n');

      // Keep the last potentially incomplete message in the buffer
      buffer = messages.pop() || '';

      // Process each complete message
      messages.forEach(processMessage);
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
};