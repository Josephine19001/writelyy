// import type { AnalysisResult, Comment, AnalysisSettings } from './types';

// export class OpenAIClient {
//   private openaiApiKey: string;
//   private openaiModel: string;

//   constructor() {
//     this.openaiApiKey = process.env.OPENAI_API_KEY || '';
//     this.openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

//     if (!this.openaiApiKey) {
//       throw new Error('OPENAI_API_KEY is required for AI analysis');
//     }
//   }

//   /**
//    * Analyze comments with custom OpenAI settings for optimization
//    */
//   async analyzeCommentsWithSettings(
//     comments: Comment[],
//     postCaption?: string,
//     settings: AnalysisSettings = {}
//   ): Promise<AnalysisResult> {
//     const commentsText = comments
//       .map(
//         (comment, index) =>
//           `${index + 1}. ${comment.content} (${comment.likes} likes)`
//       )
//       .join('\n');

//     const prompt = this.buildAnalysisPrompt(commentsText, postCaption);

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${this.openaiApiKey}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         model: this.openaiModel,
//         messages: [
//           {
//             role: 'system',
//             content:
//               'You are an expert social media analyst specializing in comment analysis for SaaS products. You extract insights, sentiment, and requests from user comments.'
//           },
//           {
//             role: 'user',
//             content: prompt
//           }
//         ],
//         temperature: settings.temperature ?? 0.3,
//         max_tokens: settings.max_tokens ?? 3000,
//         top_p: settings.top_p,
//         response_format: { type: 'json_object' }
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(
//         `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
//       );
//     }

//     const data = await response.json();

//     if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//       throw new Error('Invalid response from OpenAI API');
//     }

//     const choice = data.choices[0];
//     const finishReason = choice.finish_reason;
//     const messageContent = choice.message.content;

//     // Check if response was truncated or incomplete
//     if (finishReason === 'length') {
//       console.warn('⚠️ OpenAI response was truncated due to token limit');
//       throw new Error(
//         'OpenAI response was truncated. Please try with fewer comments or a smaller request.'
//       );
//     }

//     if (finishReason !== 'stop') {
//       console.warn('⚠️ OpenAI response finished with reason:', finishReason);
//       throw new Error(
//         `OpenAI response incomplete (finish_reason: ${finishReason}). Please try again.`
//       );
//     }

//     if (!messageContent || typeof messageContent !== 'string') {
//       throw new Error('Empty or invalid message content from OpenAI API');
//     }

//     let analysis: any;
//     try {
//       analysis = JSON.parse(messageContent);
//     } catch (parseError) {
//       console.error('❌ Failed to parse OpenAI response:', {
//         content: messageContent.substring(0, 500),
//         error: parseError,
//         finishReason,
//         fullContent: messageContent
//       });

//       // Check if response was cut off mid-JSON
//       if (!messageContent.trim().endsWith('}')) {
//         throw new Error(
//           'OpenAI response was cut off mid-JSON. The response appears incomplete. Please try again.'
//         );
//       }

//       // Try to extract JSON from the response if it's wrapped in text
//       const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         try {
//           analysis = JSON.parse(jsonMatch[0]);
//         } catch (secondParseError) {
//           throw new Error(
//             `Failed to parse OpenAI JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}. The response may be incomplete or malformed.`
//           );
//         }
//       } else {
//         throw new Error(
//           `OpenAI returned non-JSON response: ${messageContent.substring(0, 200)}...`
//         );
//       }
//     }

//     if (!analysis || typeof analysis !== 'object') {
//       throw new Error('OpenAI returned invalid analysis object');
//     }

//     return this.parseOpenAIAnalysis(analysis, comments);
//   }

//   /**
//    * Analyze comments with retry logic for incomplete responses
//    */
//   async analyzeCommentsWithRetry(
//     comments: Comment[],
//     postCaption?: string,
//     maxRetries = 2
//   ): Promise<AnalysisResult> {
//     let lastError: Error | undefined;

//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//       try {
//         console.log(`🤖 AI Analysis attempt ${attempt}/${maxRetries}`);
//         return await this.analyzeCommentsInternal(comments, postCaption);
//       } catch (error) {
//         lastError = error as Error;
//         console.warn(`⚠️ Analysis attempt ${attempt} failed:`, error);

//         // If it's a truncation or incomplete response error, retry
//         if (
//           error instanceof Error &&
//           (error.message.includes('truncated') ||
//             error.message.includes('incomplete') ||
//             error.message.includes('cut off') ||
//             error.message.includes('finish_reason'))
//         ) {
//           if (attempt < maxRetries) {
//             console.log(
//               `🔄 Retrying analysis (attempt ${attempt + 1}/${maxRetries})...`
//             );
//             // Wait a bit before retrying
//             await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
//           }
//         } else {
//           // For other errors, don't retry
//           throw error;
//         }
//       }
//     }

//     throw lastError ?? new Error('Analysis failed after all retries');
//   }

//   /**
//    * Internal method for analyzing comments (used by retry logic)
//    */
//   private async analyzeCommentsInternal(
//     comments: Comment[],
//     postCaption?: string
//   ): Promise<AnalysisResult> {
//     if (!this.openaiApiKey) {
//       throw new Error('OpenAI API key is not configured');
//     }

//     if (!comments || comments.length === 0) {
//       throw new Error('No comments provided for analysis');
//     }

//     try {
//       // Prepare comments for analysis
//       const commentsText = comments
//         .map(
//           (comment, index) =>
//             `${index + 1}. ${comment.content} (${comment.likes} likes)`
//         )
//         .join('\n');

//       const prompt = this.buildAnalysisPrompt(commentsText, postCaption);

//       const response = await fetch(
//         'https://api.openai.com/v1/chat/completions',
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${this.openaiApiKey}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             model: this.openaiModel,
//             messages: [
//               {
//                 role: 'system',
//                 content:
//                   'You are an expert social media analyst specializing in comment analysis for SaaS products. You extract insights, sentiment, and requests from user comments.'
//               },
//               {
//                 role: 'user',
//                 content: prompt
//               }
//             ],
//             temperature: 0.3,
//             max_tokens: 3000,
//             response_format: { type: 'json_object' }
//           })
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
//         );
//       }

//       const data = await response.json();

//       if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//         throw new Error('Invalid response from OpenAI API');
//       }

//       const choice = data.choices[0];
//       const finishReason = choice.finish_reason;
//       const messageContent = choice.message.content;

//       // Check if response was truncated or incomplete
//       if (finishReason === 'length') {
//         console.warn('⚠️ OpenAI response was truncated due to token limit');
//         throw new Error(
//           'OpenAI response was truncated. Please try with fewer comments or a smaller request.'
//         );
//       }

//       if (finishReason !== 'stop') {
//         console.warn('⚠️ OpenAI response finished with reason:', finishReason);
//         throw new Error(
//           `OpenAI response incomplete (finish_reason: ${finishReason}). Please try again.`
//         );
//       }

//       if (!messageContent || typeof messageContent !== 'string') {
//         throw new Error('Empty or invalid message content from OpenAI API');
//       }

//       let analysis: any;
//       try {
//         analysis = JSON.parse(messageContent);
//       } catch (parseError) {
//         console.error('❌ Failed to parse OpenAI response:', {
//           content: messageContent.substring(0, 500),
//           error: parseError,
//           finishReason,
//           fullContent: messageContent
//         });

//         // Check if response was cut off mid-JSON
//         if (!messageContent.trim().endsWith('}')) {
//           throw new Error(
//             'OpenAI response was cut off mid-JSON. The response appears incomplete. Please try again.'
//           );
//         }

//         // Try to extract JSON from the response if it's wrapped in text
//         const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
//         if (jsonMatch) {
//           try {
//             analysis = JSON.parse(jsonMatch[0]);
//           } catch (secondParseError) {
//             throw new Error(
//               `Failed to parse OpenAI JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}. The response may be incomplete or malformed.`
//             );
//           }
//         } else {
//           throw new Error(
//             `OpenAI returned non-JSON response: ${messageContent.substring(0, 200)}...`
//           );
//         }
//       }

//       if (!analysis || typeof analysis !== 'object') {
//         throw new Error('OpenAI returned invalid analysis object');
//       }

//       return this.parseOpenAIAnalysis(analysis, comments);
//     } catch (error) {
//       console.error('❌ AI analysis failed:', error);
//       throw error;
//     }
//   }

//   /**
//    * Build the analysis prompt for OpenAI
//    */
//   private buildAnalysisPrompt(
//     commentsText: string,
//     postCaption?: string
//   ): string {
//     return `
// Analyze the following social media comments${postCaption ? ` for a post about: "${postCaption}"` : ''}:

// ${commentsText}

// CRITICAL INSTRUCTIONS:
// 1. Be FACTUAL and SPECIFIC - base all insights on actual comment content
// 2. Quote specific user comments when possible
// 3. Calculate satisfaction score: (Positive Comments / Total Comments) * 100
// 4. Extract ACTUAL requests mentioned by users (e.g., "need dark mode", "add maps", "want filters")
// 5. Extract ACTUAL questions asked by users (e.g., "When will this be available?", "How much does it cost?")
// 6. Use specific examples from the comments in your analysis
// 7. For concerns/highlights: Quote actual user comments, don't paraphrase
// 8. For requests: Extract specific functionality mentioned by users
// 9. For questions: Include the exact question asked by users

// Please provide a comprehensive analysis in JSON format with the following structure:

// {
//   "sentiments": [
//     {
//       "commentIndex": 1,
//       "sentiment": "POSITIVE" | "NEGATIVE" | "QUESTION" | "FEATURE_REQUEST",
//       "confidence": 0.95,
//       "reasoning": "Brief explanation of the sentiment classification"
//     }
//   ],
//   "featureRequests": [
//     {
//       "title": "Dark Mode",
//       "description": "User comment: 'Please add dark mode, my eyes hurt at night' - Multiple users requesting dark theme option",
//       "priority": "MEDIUM",
//       "category": "UI/UX",
//       "mentionCount": 4,
//       "relatedCommentIndexes": [3, 7, 12, 18],
//       "businessValue": "Improved user experience, especially for night usage",
//       "implementationComplexity": "MEDIUM"
//     },
//     {
//       "title": "Filter by Price Range",
//       "description": "User request: 'Need price filters, too many expensive items showing' - Users want to filter products by price",
//       "priority": "HIGH",
//       "category": "FUNCTIONALITY",
//       "mentionCount": 6,
//       "relatedCommentIndexes": [2, 5, 9, 14, 21, 25],
//       "businessValue": "Better product discovery, increased conversion rates",
//       "implementationComplexity": "LOW"
//     }
//   ],
//   "questions": [
//     {
//       "question": "When will you add Android support?",
//       "category": "FEATURES",
//       "mentionCount": 3,
//       "relatedCommentIndexes": [4, 11, 16],
//       "context": "Multiple users asking about Android app availability"
//     },
//     {
//       "question": "How much does premium cost?",
//       "category": "PRICING",
//       "mentionCount": 2,
//       "relatedCommentIndexes": [8, 19],
//       "context": "Users inquiring about premium subscription pricing"
//     }
//   ],
//   "insights": {
//     "overallSentiment": "POSITIVE" | "NEGATIVE" | "MIXED",
//     "topConcerns": ["Specific user complaint: 'App crashes when I try to upload photos'", "Multiple users report: 'Takes 30+ seconds to load'"],
//     "positiveHighlights": ["User quote: 'Best app I've ever used for shopping'", "User feedback: 'Love the new dark mode feature'"],
//     "commonThemes": ["Performance complaints", "UI praise", "Specific requests"],
//     "urgentIssues": ["Critical bug: 'Can't complete purchases on iOS'", "Security concern: 'Login not working after update'"],
//     "topFeatureRequest": "Most requested feature: 'Dark Mode' (mentioned 4 times)",
//     "topQuestion": "Most asked question: 'When will Android version be available?' (asked 3 times)",
//     "userSatisfactionScore": 75.0,
//     "engagementQuality": "HIGH"
//   },
//   "clusters": [
//     {
//       "theme": "Performance Issues",
//       "commentIndexes": [2, 7, 15],
//       "sentiment": "NEGATIVE",
//       "severity": "HIGH"
//     }
//   ],
//   "recommendations": [
//     {
//       "type": "FEATURE" | "BUG_FIX" | "IMPROVEMENT" | "COMMUNICATION",
//       "title": "Recommendation title",
//       "description": "Detailed recommendation",
//       "priority": "HIGH",
//       "estimatedImpact": "HIGH" | "MEDIUM" | "LOW"
//     }
//   ]
// }

// Focus on:
// 1. Accurate sentiment classification (positive feedback, complaints, questions, requests)
// 2. Extracting specific, actionable requests with business context
// 3. Extracting clear questions from users (pricing, features, support, technical, general)
// 4. Identifying patterns and themes across comments
// 5. Prioritizing based on user engagement (likes) and frequency of mentions
// 6. Providing actionable insights for product development

// CRITICAL DISTINCTION:
// - Feature Requests: Specific functionality users want added (map feature, categories, filters, new options)
// - Concerns: Problems, bugs, or general complaints about existing functionality
// - Questions: Direct inquiries seeking information or clarification

// MANDATORY REQUIREMENTS:
// - Extract ONLY what users actually said - no assumptions or generalizations
// - Quote actual user comments in descriptions (use "User comment: '...'")
// - Calculate satisfaction score mathematically: (Positive / Total) * 100
// - ALWAYS extract requests if users mention wanting/needing new functionality
// - ALWAYS extract questions if users ask direct questions
// - Base sentiment counts on actual comment analysis, not estimates
// - Include specific comment indexes for traceability

// CRITICAL: If you mention "Requests for additional features" in commonThemes, you MUST extract those specific requests in the featureRequests array. Do not mention requests in themes without extracting them.

// EXAMPLES OF WHAT TO EXTRACT:
// - Feature Request: User says "Please add dark mode" → Extract "Dark Mode" feature
// - Feature Request: User says "Need more categories" → Extract "More Categories" feature
// - Feature Request: User says "Want partnership opportunities" → Extract "Partnership Program" feature
// - Question: User asks "When will this be on Android?" → Extract this exact question
// - Question: User asks "How can I partner with you?" → Extract this exact question
// - Concern: User says "App crashes constantly" → Include in topConcerns with quote
// - Positive: User says "Love this app!" → Include in positiveHighlights with quote
// `;
//   }

//   /**
//    * Parse OpenAI analysis response
//    */
//   private parseOpenAIAnalysis(
//     analysis: any,
//     comments: Comment[]
//   ): AnalysisResult {
//     const sentimentCounts = {
//       POSITIVE: 0,
//       NEGATIVE: 0,
//       QUESTION: 0,
//       FEATURE_REQUEST: 0,
//       COMPLIMENT: 0
//     };

//     // Process sentiments
//     const commentAnalysis = comments.map((comment, index) => {
//       const sentiment = analysis.sentiments?.find(
//         (s: any) => s.commentIndex === index + 1
//       );
//       const sentimentType = sentiment?.sentiment || 'POSITIVE';

//       // Safely increment sentiment count
//       if (sentimentType in sentimentCounts) {
//         sentimentCounts[sentimentType as keyof typeof sentimentCounts]++;
//       }

//       return {
//         ...comment,
//         sentiment: sentimentType,
//         confidence: sentiment?.confidence || 0.5,
//         reasoning: sentiment?.reasoning || ''
//       };
//     });

//     // Process requests
//     const featureRequests = (analysis.featureRequests || []).map((fr: any) => ({
//       title: fr.title,
//       description: fr.description,
//       priority: fr.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
//       category: fr.category,
//       mentionCount: fr.mentionCount || 1,
//       relatedComments:
//         fr.relatedCommentIndexes
//           ?.map((idx: number) => comments[idx - 1]?.content)
//           .filter(Boolean) || [],
//       businessValue: fr.businessValue,
//       implementationComplexity: fr.implementationComplexity
//     }));

//     // Process questions
//     const questions = (analysis.questions || []).map((q: any) => ({
//       question: q.question,
//       category: q.category as
//         | 'PRICING'
//         | 'FEATURES'
//         | 'SUPPORT'
//         | 'TECHNICAL'
//         | 'GENERAL',
//       isCompliment: q.isCompliment || false,
//       mentionCount: q.mentionCount || 1,
//       relatedComments:
//         q.relatedCommentIndexes
//           ?.map((idx: number) => comments[idx - 1]?.content)
//           .filter(Boolean) || [],
//       context: q.context || ''
//     }));

//     return {
//       sentimentCounts,
//       commentAnalysis,
//       featureRequests,
//       questions,
//       insights: analysis.insights || {},
//       clusters: analysis.clusters || [],
//       recommendations: analysis.recommendations || []
//     };
//   }
// }
