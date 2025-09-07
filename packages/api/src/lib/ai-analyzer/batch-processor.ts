import type { AnalysisResult, Comment } from './types';

/**
 * Create batches of comments for processing
 */
export function createBatches(
  comments: Comment[],
  batchSize: number
): Comment[][] {
  const batches = [];
  for (let i = 0; i < comments.length; i += batchSize) {
    batches.push(comments.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Combine multiple batch analysis results into a single result
 */
export function combineBatchResults(
  batchResults: AnalysisResult[],
  originalComments: Comment[]
): AnalysisResult {
  // Combine all arrays
  const allCommentAnalysis: AnalysisResult['commentAnalysis'] = [];
  const allFeedback: AnalysisResult['feedback'] = [];
  const allIssues: AnalysisResult['issues'] = [];
  const allQuestions: AnalysisResult['questions'] = [];
  const allKeyInsights: string[] = [];
  const allTopConcerns: string[] = [];

  let totalSatisfactionScore = 0;
  let satisfactionCount = 0;

  // Process each batch result
  for (const batchResult of batchResults) {
    // Combine arrays
    allCommentAnalysis.push(...batchResult.commentAnalysis);
    allFeedback.push(...batchResult.feedback);
    allIssues.push(...batchResult.issues);
    allQuestions.push(...batchResult.questions);
    allKeyInsights.push(...batchResult.insights.keyInsights);
    allTopConcerns.push(...batchResult.insights.topConcerns);

    // Accumulate satisfaction scores
    if (batchResult.insights.userSatisfactionScore > 0) {
      totalSatisfactionScore += batchResult.insights.userSatisfactionScore;
      satisfactionCount++;
    }
  }

  // Deduplicate and prioritize feedback
  const uniqueFeedback = deduplicateFeedback(allFeedback);

  // Deduplicate and prioritize issues
  const uniqueIssues = deduplicateIssues(allIssues);

  // Deduplicate and prioritize questions
  const uniqueQuestions = deduplicateQuestions(allQuestions);

  // Calculate overall metrics
  const totalComments = originalComments.length;
  const avgSatisfactionScore =
    satisfactionCount > 0 ? totalSatisfactionScore / satisfactionCount : 0;

  // Calculate overall sentiment from comment analysis
  const positiveCount = allCommentAnalysis.filter(
    (c) => c.sentiment === 'POSITIVE' || c.sentiment === 'COMPLIMENT'
  ).length;
  const negativeCount = allCommentAnalysis.filter(
    (c) => c.sentiment === 'NEGATIVE'
  ).length;

  let overallSentiment: 'POSITIVE' | 'NEGATIVE' | 'MIXED' = 'MIXED';
  if (positiveCount > negativeCount && positiveCount > totalComments * 0.5) {
    overallSentiment = 'POSITIVE';
  } else if (
    negativeCount > positiveCount &&
    negativeCount > totalComments * 0.3
  ) {
    overallSentiment = 'NEGATIVE';
  }

  return {
    commentAnalysis: allCommentAnalysis,
    feedback: uniqueFeedback.slice(0, 20), // Top 20 feedback items
    issues: uniqueIssues.slice(0, 15), // Top 15 issues
    questions: uniqueQuestions.slice(0, 15), // Top 15 questions
    insights: {
      overallSentiment,
      userSatisfactionScore: Math.round(avgSatisfactionScore),
      keyInsights: getTopItems(allKeyInsights, 10),
      topConcerns: getTopItems(allTopConcerns, 10)
    }
  };
}

/**
 * Deduplicate feedback by title similarity
 */
function deduplicateFeedback(
  feedback: AnalysisResult['feedback']
): AnalysisResult['feedback'] {
  const seen = new Set<string>();
  const unique: AnalysisResult['feedback'] = [];

  for (const item of feedback) {
    const key = item.title.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    } else {
      // Merge with existing item
      const existingIndex = unique.findIndex(
        (u) => u.title.toLowerCase().replace(/\s+/g, ' ').trim() === key
      );
      if (existingIndex !== -1) {
        unique[existingIndex].mentions += item.mentions;
      }
    }
  }

  return unique.sort((a, b) => {
    // Sort by priority first, then by mention count
    const priorityOrder = { HIGH: 3, MODERATE: 2, LOW: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    return priorityDiff !== 0 ? priorityDiff : b.mentions - a.mentions;
  });
}

/**
 * Deduplicate issues by title similarity
 */
function deduplicateIssues(
  issues: AnalysisResult['issues']
): AnalysisResult['issues'] {
  const seen = new Set<string>();
  const unique: AnalysisResult['issues'] = [];

  for (const item of issues) {
    const key = item.title.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    } else {
      // Merge with existing item
      const existingIndex = unique.findIndex(
        (u) => u.title.toLowerCase().replace(/\s+/g, ' ').trim() === key
      );
      if (existingIndex !== -1) {
        unique[existingIndex].mentions += item.mentions;
      }
    }
  }

  return unique.sort((a, b) => {
    // Sort by priority first, then by mention count
    const priorityOrder = { HIGH: 3, MODERATE: 2, LOW: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    return priorityDiff !== 0 ? priorityDiff : b.mentions - a.mentions;
  });
}

/**
 * Deduplicate questions by content similarity
 */
function deduplicateQuestions(
  questions: AnalysisResult['questions']
): AnalysisResult['questions'] {
  const seen = new Set<string>();
  const unique: AnalysisResult['questions'] = [];

  for (const item of questions) {
    const key = item.question.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    } else {
      // Merge with existing item
      const existingIndex = unique.findIndex(
        (u) => u.question.toLowerCase().replace(/\s+/g, ' ').trim() === key
      );
      if (existingIndex !== -1) {
        unique[existingIndex].mentions += item.mentions;
      }
    }
  }

  return unique.sort((a, b) => b.mentions - a.mentions);
}

/**
 * Get top items from an array by frequency
 */
function getTopItems(items: string[], limit: number): string[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([item]) => item);
}
