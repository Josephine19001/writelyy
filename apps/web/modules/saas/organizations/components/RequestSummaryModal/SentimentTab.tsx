import { ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@ui/components/accordion';
import type { Post } from '../../lib/posts-utils';

interface SentimentTabProps {
  post: Post;
}

export function SentimentTab({ post }: SentimentTabProps) {
  // Calculate sentiment counts from individual comments
  const getSentimentCounts = () => {
    if (!post.comments)
      return { positive: 0, negative: 0, neutral: 0, compliment: 0, total: 0 };

    const counts = post.comments.reduce(
      (acc, comment) => {
        if (comment.sentiment === 'POSITIVE') acc.positive++;
        else if (comment.sentiment === 'NEGATIVE') acc.negative++;
        else if (comment.sentiment === 'NEUTRAL') acc.neutral++;
        else if (comment.sentiment === 'COMPLIMENT') acc.compliment++;
        acc.total++;
        return acc;
      },
      { positive: 0, negative: 0, neutral: 0, compliment: 0, total: 0 }
    );

    return counts;
  };

  const sentimentCounts = getSentimentCounts();

  return (
    <div>
      {post.analysis ? (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <ThumbsUpIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Positive
                </span>
              </div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                {sentimentCounts.positive}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <ThumbsDownIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Negative
                </span>
              </div>
              <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                {sentimentCounts.negative}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">─</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Neutral
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {sentimentCounts.neutral}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Overall Sentiment
              </span>
              <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                {post.analysis.overallSentiment || 'N/A'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">💛</span>
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Compliments
                </span>
              </div>
              <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                {sentimentCounts.compliment}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Satisfaction Score
              </span>
              <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                {post.analysis.userSatisfactionScore
                  ? `${Math.round(post.analysis.userSatisfactionScore)}%`
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Analysis Insights - Accordion Format */}
          <Accordion type="multiple" className="w-full">
            {(post.analysis.positiveHighlights?.length ?? 0) > 0 && (
              <AccordionItem value="positive-highlights">
                <AccordionTrigger className="text-green-800">
                  <div className="flex items-center gap-2">
                    <ThumbsUpIcon className="h-4 w-4" />
                    Positive Highlights (
                    {post.analysis.positiveHighlights?.length ?? 0})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <ul className="space-y-2">
                      {post.analysis.positiveHighlights?.map(
                        (highlight, index) => (
                          <li
                            key={index}
                            className="text-sm text-green-700 flex items-start gap-2"
                          >
                            <span className="text-green-600 mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {(post.analysis.topConcerns?.length ?? 0) > 0 && (
              <AccordionItem value="top-concerns">
                <AccordionTrigger className="text-red-800">
                  <div className="flex items-center gap-2">
                    <ThumbsDownIcon className="h-4 w-4" />
                    Top Concerns ({post.analysis.topConcerns?.length ?? 0})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <ul className="space-y-2">
                      {post.analysis.topConcerns?.map((concern, index) => (
                        <li
                          key={index}
                          className="text-sm text-red-700 flex items-start gap-2"
                        >
                          <span className="text-red-600 mt-1">•</span>
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {(post.analysis.commonThemes?.length ?? 0) > 0 && (
              <AccordionItem value="common-themes">
                <AccordionTrigger className="text-blue-800">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">💭</span>
                    Common Themes ({post.analysis.commonThemes?.length ?? 0})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <ul className="space-y-2">
                      {post.analysis.commonThemes?.map((theme, index) => (
                        <li
                          key={index}
                          className="text-sm text-blue-700 flex items-start gap-2"
                        >
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{theme}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {post.analysis.issues && post.analysis.issues.length > 0 && (
              <AccordionItem value="urgent-issues">
                <AccordionTrigger className="text-orange-800">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">⚠️</span>
                    Issues ({post.analysis.issues.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <ul className="space-y-2">
                      {post.analysis.issues.map((issue, index) => (
                        <li
                          key={index}
                          className="text-sm text-orange-700 flex items-start gap-2"
                        >
                          <span className="text-orange-600 mt-1">•</span>
                          <span>
                            {typeof issue === 'string'
                              ? issue
                              : issue.title || issue.description || 'Issue'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Feature Request Summary */}
            {post.analysis?.feedback && post.analysis.feedback.length > 0 && (
              <AccordionItem value="feature-summary">
                <AccordionTrigger className="text-blue-800">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">🚀</span>
                    Top Request
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <p className="text-sm text-blue-700">
                      Most requested:{' '}
                      <strong>
                        "
                        {post.analysis.feedback[0].title ||
                          post.analysis.feedback[0].name ||
                          'Unnamed Feedback'}
                        "
                      </strong>{' '}
                      (
                      {post.analysis.feedback[0].mentions ||
                        post.analysis.feedback[0].totalMentions ||
                        0}{' '}
                      mentions)
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      "
                      {post.analysis.feedback[0].topComment ||
                        post.analysis.feedback[0].description ||
                        'No description available'}
                      "
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Question Summary */}
            {post.analysis?.questions && post.analysis.questions.length > 0 && (
              <AccordionItem value="question-summary">
                <AccordionTrigger className="text-purple-800">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">❓</span>
                    Top Question
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <p className="text-sm text-purple-700">
                      Most asked:{' '}
                      <strong>"{post.analysis.questions[0].question}"</strong> (
                      {post.analysis.questions[0].mentions ||
                        post.analysis.questions[0].totalMentions ||
                        0}{' '}
                      mentions)
                    </p>
                    <p className="text-xs text-purple-600 mt-2">
                      "
                      {post.analysis.questions[0].topComment ||
                        post.analysis.questions[0].description ||
                        'No description available'}
                      "
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No sentiment analysis available. Analyze this post to see detailed
            insights.
          </p>
        </div>
      )}
    </div>
  );
}
