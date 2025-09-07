import Groq from 'groq-sdk';
import { mapQuestionCategory, mapPriority } from '@repo/database';
import type { Comment, AnalysisResult } from './types';

export class GroqClient {
  private groq: Groq;
  private model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  private maxTokensPerRequest = 8000;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is missing');
    }
    this.groq = new Groq({ apiKey });
  }

  async analyzeComments(
    comments: Comment[],
    postCaption?: string
  ): Promise<AnalysisResult> {
    const sanitized = this.sanitizeComments(comments);
    const batches = this.createBatchesByTokenEstimate(sanitized);

    const results = await Promise.allSettled(
      batches.map((batch, index) =>
        this.analyzeBatch(batch, index === 0 ? postCaption : undefined)
      )
    );

    const validResults = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<AnalysisResult>).value);

    if (!validResults.length) {
      throw new Error('All analysis attempts failed');
    }

    return this.mergeResults(validResults);
  }

  private async analyzeBatch(
    comments: Comment[],
    postCaption?: string
  ): Promise<AnalysisResult> {
    const prompt = this.buildPrompt(comments, postCaption);
    const res = await this.groq.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a world-class sentiment analyst. Analyze comments carefully and detect negative sentiment accurately. Many comments may be critical, skeptical, or dismissive - classify these as NEGATIVE. Return accurate JSON with proper sentiment and type classification.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.05,
      max_tokens: 8000,
      top_p: 0.85,
      response_format: { type: 'json_object' }
    });

    const content = res.choices[0].message?.content;
    if (!content) {
      throw new Error('No response from Groq');
    }

    const analysis = JSON.parse(content);
    return this.buildAnalysisResult(analysis, comments);
  }

  private buildAnalysisResult(
    analysis: any,
    comments: Comment[]
  ): AnalysisResult {
    // Process comments with sentiment analysis only (no individual type classification)
    const commentAnalysis = comments.map((comment, index) => {
      const aiComment = analysis.sentiments?.find(
        (s: any) => s.i === index + 1
      );

      const aiSentiment = aiComment?.s || 'NEUTRAL';

      // Map sentiment - include neutral and compliment detection
      let sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'COMPLIMENT' =
        'NEUTRAL';

      const content = comment.content.toLowerCase();
      const isShortPositive =
        content.length < 50 &&
        (content.includes('good') ||
          content.includes('nice') ||
          content.includes('great') ||
          content.includes('love') ||
          content.includes('awesome') ||
          content.includes('thanks') ||
          content.includes('cool') ||
          content.includes('perfect'));

      // Handle AI sentiment response properly
      if (aiSentiment === 'NEGATIVE') {
        sentiment = 'NEGATIVE';
      } else if (aiSentiment === 'COMPLIMENT') {
        sentiment = 'COMPLIMENT';
      } else if (aiSentiment === 'POSITIVE' && isShortPositive) {
        sentiment = 'COMPLIMENT';
      } else if (aiSentiment === 'POSITIVE') {
        sentiment = 'POSITIVE';
      } else if (aiSentiment === 'NEUTRAL') {
        sentiment = 'NEUTRAL';
      } else {
        sentiment = 'NEUTRAL';
      }

      return {
        content: comment.content,
        likes: comment.likes,
        author: comment.author,
        sentiment
      };
    });

    // Process feedback with comment IDs
    const feedback = (analysis.feedback || []).map((f: any) => ({
      title: f.title || 'Feedback',
      description: f.desc || '',
      priority: mapPriority(f.priority),
      mentions: f.count || 1,
      topComment: f.desc || '',
      commentIds: f.commentIds || [] // Array of comment indices
    }));

    // Process questions with comment IDs
    const questions = (analysis.questions || []).map((q: any) => ({
      question: q.q || q.title || 'Question',
      description: q.desc || '',
      category: mapQuestionCategory(q.category),
      mentions: q.count || 1,
      topComment: q.desc || q.q || '',
      commentIds: q.commentIds || [] // Array of comment indices
    }));

    // Process issues with comment IDs
    const issues = (analysis.issues || []).map((i: any) => ({
      title: i.title || 'Issue',
      description: i.desc || '',
      priority: mapPriority(i.priority),
      mentions: i.count || 1,
      topComment: i.desc || '',
      commentIds: i.commentIds || [] // Array of comment indices
    }));

    // Calculate overall sentiment from comment sentiment analysis
    const feedbackCount = feedback.length;
    const issueCount = issues.length;
    const totalComments = commentAnalysis.length;

    let overallSentiment: 'POSITIVE' | 'NEGATIVE' | 'MIXED' = 'MIXED';
    const positiveCount = commentAnalysis.filter(
      (c) => c.sentiment === 'POSITIVE' || c.sentiment === 'COMPLIMENT'
    ).length;
    const negativeCount = commentAnalysis.filter(
      (c) => c.sentiment === 'NEGATIVE'
    ).length;

    if (positiveCount > negativeCount && positiveCount > totalComments * 0.5) {
      overallSentiment = 'POSITIVE';
    } else if (
      negativeCount > positiveCount &&
      negativeCount > totalComments * 0.3
    ) {
      overallSentiment = 'NEGATIVE';
    }

    // Calculate satisfaction score
    const userSatisfactionScore = Math.round(
      (positiveCount / totalComments) * 100
    );

    return {
      commentAnalysis,
      feedback,
      questions,
      issues,
      insights: {
        overallSentiment,
        userSatisfactionScore,
        keyInsights: analysis.insights?.highlights || [],
        topConcerns: analysis.insights?.concerns || []
      }
    };
  }

  private buildPrompt(comments: Comment[], postCaption?: string): string {
    const text = comments
      .map((c, i) => `[${i + 1}] ${c.content.trim()} (${c.likes || 0} likes)`)
      .join('\n');

    return `You are an expert sentiment analyst and product analyst. Analyze ${comments.length} comments${
      postCaption ? ` about: "${postCaption}"` : ''
    }.

For EACH comment, determine the **SENTIMENT** (emotional tone): POSITIVE, NEGATIVE, NEUTRAL, or COMPLIMENT

Then identify structured themes by grouping related comments into FEEDBACK, QUESTIONS, and ISSUES.

**SENTIMENT ANALYSIS RULES:**

**POSITIVE**: Generally supportive, interested, or constructive
- "This is helpful", "Interesting approach", "I want to try this"
- Questions asked with genuine interest
- General positive or constructive expressions

**NEGATIVE**: Critical, dismissive, skeptical, or hostile  
- "This is BS", "Scammy", "Doesn't work", "This sucks"
- Skeptical or dismissive language
- Complaints, criticism, or negative emotions
- Emojis like 🧢 (cap/lie), eye-rolls, laughing at (not with)

**NEUTRAL**: Neither positive nor negative, factual or indifferent
- "This is okay", "It's just a suggestion", "I'm not sure"
- Factual statements without emotional tone
- Indifferent responses or observations

**COMPLIMENT**: Short, enthusiastic praise or thanks
- "Great job!", "Love it!", "Awesome!", "Thanks!", "Nice!"
- Brief positive expressions under 50 characters
- Enthusiastic appreciation

**STRUCTURED THEME ANALYSIS:**

**FEEDBACK**: Group comments that suggest improvements or provide advice
- Business strategy suggestions
- Feature requests
- Constructive recommendations

**QUESTIONS**: Group comments that ask for information or clarification
- "How do I...?", "What is...?", "Can you...?"
- Help requests or clarification needs

**ISSUES**: Group comments that report problems or concerns
- Technical difficulties or bugs
- Complaints about functionality
- Concerns about legitimacy or safety

COMMENTS TO ANALYZE:
${text}

Return this exact JSON structure:
{
  "sentiments": [
    {
      "i": 1,
      "s": "POSITIVE|NEGATIVE|NEUTRAL|COMPLIMENT",
      "analysis": "Brief explanation of sentiment choice"
    }
  ],
  "feedback": [
    {
      "title": "Brief title",
      "desc": "Description of the feedback theme",
      "priority": "HIGH|MEDIUM|LOW",
      "count": 2,
      "commentIds": [1, 5],
      "topThreeComments": ["example1", "example2"]
    }
  ],
  "issues": [
    {
      "title": "Brief title", 
      "desc": "Description of the issue",
      "priority": "HIGH|MEDIUM|LOW",
      "count": 3,
      "commentIds": [2, 7, 9],
      "topThreeComments": ["example1", "example2"]
    }
  ],
  "questions": [
    {
      "title": "Brief title",
      "desc": "Description of common questions",
      "q": "Main question being asked",
      "count": 2,
      "commentIds": [3, 8],
      "topThreeComments": ["example1", "example2"]
    }
  ],
  "insights": {
    "sentiment": "POSITIVE|NEGATIVE|MIXED",
    "score": 85,
    "highlights": ["positive themes"],
    "concerns": ["negative themes"]
  }
}

**CRITICAL**: 
1. Analyze each comment's SENTIMENT independently
2. Use NEUTRAL for factual/indifferent comments
3. Include commentIds arrays with the 1-based comment numbers that belong to each theme
4. Don't force every comment into feedback/questions/issues - only group comments that clearly fit`;
  }

  private sanitizeComments(comments: Comment[]): Comment[] {
    return comments
      .filter((c) => c.content && c.content.trim().length > 0)
      .map((c) => ({
        ...c,
        content: c.content.trim().replace(/\s+/g, ' ').substring(0, 500)
      }));
  }

  private createBatchesByTokenEstimate(comments: Comment[]): Comment[][] {
    const batches: Comment[][] = [];
    let currentBatch: Comment[] = [];
    let currentTokens = 0;

    for (const comment of comments) {
      const estimatedTokens = Math.ceil(comment.content.length / 4);

      if (
        currentTokens + estimatedTokens > this.maxTokensPerRequest &&
        currentBatch.length > 0
      ) {
        batches.push(currentBatch);
        currentBatch = [comment];
        currentTokens = estimatedTokens;
      } else {
        currentBatch.push(comment);
        currentTokens += estimatedTokens;
      }
    }

    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    return batches;
  }

  private mergeResults(results: AnalysisResult[]): AnalysisResult {
    const merged: AnalysisResult = {
      commentAnalysis: [],
      feedback: [],
      issues: [],
      questions: [],
      insights: {
        overallSentiment: 'MIXED',
        userSatisfactionScore: 0,
        keyInsights: [],
        topConcerns: []
      }
    };

    for (const r of results) {
      merged.commentAnalysis.push(...r.commentAnalysis);
      merged.feedback.push(...r.feedback);
      merged.issues.push(...r.issues);
      merged.questions.push(...r.questions);
      merged.insights.keyInsights.push(...r.insights.keyInsights);
      merged.insights.topConcerns.push(...r.insights.topConcerns);
    }

    // Calculate overall sentiment from comment analysis
    const totalComments = merged.commentAnalysis.length;
    const positiveCount = merged.commentAnalysis.filter(
      (c) => c.sentiment === 'POSITIVE' || c.sentiment === 'COMPLIMENT'
    ).length;
    const negativeCount = merged.commentAnalysis.filter(
      (c) => c.sentiment === 'NEGATIVE'
    ).length;

    if (positiveCount > negativeCount && positiveCount > totalComments * 0.5) {
      merged.insights.overallSentiment = 'POSITIVE';
    } else if (
      negativeCount > positiveCount &&
      negativeCount > totalComments * 0.3
    ) {
      merged.insights.overallSentiment = 'NEGATIVE';
    } else {
      merged.insights.overallSentiment = 'MIXED';
    }

    // Calculate satisfaction score
    merged.insights.userSatisfactionScore = Math.round(
      (positiveCount / totalComments) * 100
    );

    return merged;
  }
}
