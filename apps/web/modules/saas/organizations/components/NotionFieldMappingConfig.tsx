'use client';

import { Card, CardContent } from '@ui/components/card';
import { DatabaseIcon } from 'lucide-react';

export function NotionFieldMappingConfig() {
  return (
    <Card className="max-w-2xl">
      <CardContent className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <DatabaseIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Single Database Setup
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
                Create these fields in your Notion database:
              </p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="text-blue-700 dark:text-blue-200">
                  <strong>Name</strong> (Title) - Auto-populated with request
                  title
                </div>
                <div className="text-blue-700 dark:text-blue-200">
                  <strong>Type</strong> (Select: Feature, Issue, Question) -
                  Auto-populated based on content type
                </div>
                <div className="text-blue-700 dark:text-blue-200">
                  <strong>Status</strong> (Select) - Auto-populated with "New"
                </div>
                <div className="text-blue-700 dark:text-blue-200">
                  <strong>Priority</strong> (Select: High, Medium, Low) -
                  Auto-populated from AI analysis
                </div>
                <div className="text-blue-700 dark:text-blue-200">
                  <strong>Description</strong> (Rich Text or Text) - Formatted
                  with top comments
                </div>
              </div>

              <p className="text-xs text-blue-600 dark:text-blue-300">
                💡 All fields will be automatically populated when creating
                tickets from your feedback.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
