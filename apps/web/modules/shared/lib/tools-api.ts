import { apiClient } from '@shared/lib/api-client';
import { useMutation, useQuery } from '@tanstack/react-query';

// Types for API responses
interface HumanizerResponse {
  outputText: string;
  wordCount: number;
  charactersUsed: number;
  creditsUsed?: number;
}

interface DetectorResponse {
  aiProbability: number;
  detectionResult: 'Human' | 'AI' | 'Mixed';
  wordCount: number;
  charactersUsed: number;
  creditsUsed?: number;
  confidence: string;
}

interface SummariserResponse {
  summaryText: string;
  wordCount: number;
  charactersUsed: number;
  creditsUsed?: number;
  reductionPercentage: number;
}

interface ParaphraserResponse {
  paraphrasedText: string;
  wordCount: number;
  charactersUsed: number;
  creditsUsed?: number;
}

interface HistoryEntry {
  id: string;
  tone?: string;
  style?: string;
  summaryType?: string;
  aiProbability?: number;
  detectionResult?: string;
  wordCount: number;
  charactersUsed: number;
  creditsUsed?: number;
  createdAt: string;
  inputText: string;
  outputText?: string;
  summaryText?: string;
  paraphrasedText?: string;
}

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'down';
  services: {
    openai: boolean;
    groq: boolean;
  };
  timestamp: string;
}

// Humanizer API
export const useHumanizeTextMutation = () => {
  return useMutation({
    mutationKey: ['humanize-text'],
    mutationFn: async ({
      inputText,
      tone = 'default'
    }: {
      inputText: string;
      tone?: string;
    }): Promise<HumanizerResponse> => {
      const response = await apiClient.tools.humanizer.process.$post({
        json: { inputText, tone }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to humanize text');
      }

      return await response.json();
    }
  });
};

export const useHumanizerHistoryQuery = (limit = 10) => {
  return useQuery({
    queryKey: ['humanizer-history', limit],
    queryFn: async (): Promise<{ history: HistoryEntry[] }> => {
      const response = await apiClient.tools.humanizer.history.$get({
        query: { limit: limit.toString() }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch humanizer history');
      }

      return await response.json();
    }
  });
};

// Detector API
export const useDetectTextMutation = () => {
  return useMutation({
    mutationKey: ['detect-text'],
    mutationFn: async ({
      inputText
    }: {
      inputText: string;
    }): Promise<DetectorResponse> => {
      const response = await apiClient.tools.detector.analyze.$post({
        json: { inputText }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze text');
      }

      return await response.json();
    }
  });
};

export const useDetectorHistoryQuery = (limit = 10) => {
  return useQuery({
    queryKey: ['detector-history', limit],
    queryFn: async (): Promise<{ history: HistoryEntry[] }> => {
      const response = await apiClient.tools.detector.history.$get({
        query: { limit: limit.toString() }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch detector history');
      }

      return await response.json();
    }
  });
};

// Summariser API
export const useSummarizeTextMutation = () => {
  return useMutation({
    mutationKey: ['summarize-text'],
    mutationFn: async ({
      inputText,
      summaryType = 'brief'
    }: {
      inputText: string;
      summaryType?: 'brief' | 'detailed' | 'key-points';
    }): Promise<SummariserResponse> => {
      const response = await apiClient.tools.summariser.process.$post({
        json: { inputText, summaryType }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to summarize text');
      }

      return await response.json();
    }
  });
};

export const useSummariserHistoryQuery = (limit = 10) => {
  return useQuery({
    queryKey: ['summariser-history', limit],
    queryFn: async (): Promise<{ history: HistoryEntry[] }> => {
      const response = await apiClient.tools.summariser.history.$get({
        query: { limit: limit.toString() }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summariser history');
      }

      return await response.json();
    }
  });
};

// Paraphraser API
export const useParaphraseTextMutation = () => {
  return useMutation({
    mutationKey: ['paraphrase-text'],
    mutationFn: async ({
      inputText,
      style = 'formal'
    }: {
      inputText: string;
      style?: 'formal' | 'casual' | 'academic' | 'creative';
    }): Promise<ParaphraserResponse> => {
      const response = await apiClient.tools.paraphraser.process.$post({
        json: { inputText, style }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to paraphrase text');
      }

      return await response.json();
    }
  });
};

export const useParaphraserHistoryQuery = (limit = 10) => {
  return useQuery({
    queryKey: ['paraphraser-history', limit],
    queryFn: async (): Promise<{ history: HistoryEntry[] }> => {
      const response = await apiClient.tools.paraphraser.history.$get({
        query: { limit: limit.toString() }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch paraphraser history');
      }

      return await response.json();
    }
  });
};

// Health check API
export const useToolsHealthQuery = () => {
  return useQuery({
    queryKey: ['tools-health'],
    queryFn: async (): Promise<HealthResponse> => {
      const response = await apiClient.tools.health.$get();

      if (!response.ok) {
        throw new Error('Failed to check tools health');
      }

      return await response.json();
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: false
  });
};