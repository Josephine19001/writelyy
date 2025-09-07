import type { AnalysisResult, Comment, ProgressCallback } from './types';
import { GroqClient } from './groq-client';
import { createBatches, combineBatchResults } from './batch-processor';

// For high-concurrency scenarios, install: npm i p-limit
// import pLimit from 'p-limit';

export class AIAnalyzer {
  private groqClient: GroqClient;

  constructor() {
    this.groqClient = new GroqClient();
  }

  async analyzeCommentsOptimized(
    comments: Comment[],
    postCaption?: string,
    progressCallback?: ProgressCallback
  ): Promise<AnalysisResult> {
    if (!comments || comments.length === 0) {
      throw new Error('No comments provided for analysis');
    }

    if (comments.length <= 50) {
      return this.analyzeComments(comments, postCaption);
    }

    progressCallback?.({
      current: 0,
      total: 100,
      stage: 'Preparing batch analysis'
    });

    // Don't sort comments - preserve original order for proper index mapping
    const batches = createBatches(comments, 50);

    progressCallback?.({
      current: 10,
      total: 100,
      stage: `Analyzing ${batches.length} batches`
    });

    // Process all batches in parallel for 5-10x speedup
    const results = await Promise.allSettled(
      batches.map((batch, i) =>
        this.groqClient.analyzeComments(
          batch,
          i === 0 ? postCaption : undefined
        )
      )
    );

    const batchResults = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<AnalysisResult>).value);

    if (batchResults.length === 0) {
      throw new Error('All batch analyses failed');
    }

    progressCallback?.({
      current: 85,
      total: 100,
      stage: 'Combining batch results'
    });

    const combinedResult = combineBatchResults(batchResults, comments);

    progressCallback?.({ current: 100, total: 100, stage: 'Complete' });

    return combinedResult;
  }

  // Alternative method with concurrency limiting for high-traffic scenarios
  async analyzeCommentsWithConcurrencyLimit(
    comments: Comment[],
    postCaption?: string,
    progressCallback?: ProgressCallback,
    maxConcurrency = 5
  ): Promise<AnalysisResult> {
    if (comments.length <= 50) {
      return this.analyzeComments(comments, postCaption);
    }

    // Don't sort comments - preserve original order for proper index mapping
    const batches = createBatches(comments, 50);

    // Uncomment these lines if you need concurrency limiting:
    // const pLimit = require('p-limit');
    // const limit = pLimit(maxConcurrency);

    const results = await Promise.allSettled(
      batches.map(
        (batch, i) =>
          // limit(() =>  // Uncomment this line for concurrency limiting
          this.groqClient.analyzeComments(
            batch,
            i === 0 ? postCaption : undefined
          )
        // )  // Uncomment this line for concurrency limiting
      )
    );

    const batchResults = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<AnalysisResult>).value);

    if (batchResults.length === 0) {
      throw new Error('All batch analyses failed');
    }

    return combineBatchResults(batchResults, comments);
  }

  async analyzeComments(
    comments: Comment[],
    postCaption?: string
  ): Promise<AnalysisResult> {
    return this.groqClient.analyzeComments(comments, postCaption);
  }

  async batchAnalyze(
    posts: Array<{
      id: string;
      comments: Comment[];
      caption?: string;
    }>
  ): Promise<Map<string, AnalysisResult>> {
    const results = new Map<string, AnalysisResult>();

    const batchSize = 5;
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize);

      const batchPromises = batch.map(async (post) => {
        const result = await this.analyzeComments(post.comments, post.caption);
        results.set(post.id, result);
      });

      await Promise.all(batchPromises);

      // Add delay between batches to respect rate limits
      if (i + batchSize < posts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
}

export type { AnalysisResult, Comment, ProgressCallback } from './types';
