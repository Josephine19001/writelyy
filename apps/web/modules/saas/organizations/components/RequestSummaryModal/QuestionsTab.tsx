import type { Post } from '../../lib/posts-utils';

interface QuestionsTabProps {
  post: Post;
}

export function QuestionsTab({ post }: QuestionsTabProps) {
  return (
    <div>
      {post.analysis?.questions && post.analysis.questions.length > 0 ? (
        <div className="space-y-4">
          {post.analysis.questions.map((question: any, index: number) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {question.question}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      question.category === 'PRICING'
                        ? 'bg-green-100 text-green-700'
                        : question.category === 'FEATURES'
                          ? 'bg-blue-100 text-blue-700'
                          : question.category === 'SUPPORT'
                            ? 'bg-orange-100 text-orange-700'
                            : question.category === 'TECHNICAL'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {question.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {question.mentions || question.totalMentions || 0} mention
                    {(question.mentions || question.totalMentions || 0) !== 1
                      ? 's'
                      : ''}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {question.topComment ||
                  question.description ||
                  'No description available'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No questions found in this post.
          </p>
        </div>
      )}
    </div>
  );
}
