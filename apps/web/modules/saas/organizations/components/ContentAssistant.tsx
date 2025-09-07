'use client';

import { Button } from '@ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/card';
import {
  BotIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HashIcon,
  LightbulbIcon,
  MaximizeIcon,
  Minimize2Icon,
  MinusIcon,
  SendIcon,
  TargetIcon,
  TrendingUpIcon,
  XIcon
} from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ContentAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `👋 Hi! I'm your Content Assistant. I can help you with:\n\n🎯 **Content Ideas** - Creative concepts and topics\n📊 **Strategy Planning** - Content planning and organization\n💡 **Creative Writing** - Help with copywriting and messaging\n🔥 **Best Practices** - Tips for engaging content\n\nWhat would you like to explore today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    {
      icon: TrendingUpIcon,
      label: 'Content Strategy',
      prompt: 'Help me develop a content strategy for my business'
    },
    {
      icon: HashIcon,
      label: 'Content Planning',
      prompt: 'Give me ideas for organizing my content calendar'
    },
    {
      icon: LightbulbIcon,
      label: 'Creative Ideas',
      prompt: 'Generate 10 creative content ideas for my audience'
    },
    {
      icon: TargetIcon,
      label: 'Audience Engagement',
      prompt: 'Help me understand how to better engage with my audience'
    }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const generateAIResponse = (message: string): string => {
    const responses = {
      strategy: `🎯 **Content Strategy Framework:**

1. **Define Your Goals** - What do you want to achieve?
2. **Know Your Audience** - Who are you creating content for?
3. **Content Pillars** - 3-5 main topics you'll focus on
4. **Content Types** - Mix of educational, entertaining, and promotional
5. **Consistency** - Regular posting schedule and product voice

💡 **Pro Tip:** Start with one pillar and expand gradually!`,

      planning: `📅 **Content Planning Best Practices:**

**Weekly Planning:**
✅ Monday: Plan the week's content
✅ Tuesday-Thursday: Create and publish
✅ Friday: Engage and respond to comments
✅ Weekend: Research and brainstorm

**Content Mix (80/20 Rule):**
📚 80% Value-driven content (tips, education, entertainment)
🎯 20% Promotional content (products, services)

**Tools to Help:**
📝 Content calendar templates
🎨 Design tools for visuals
📊 Analytics to track performance`,

      ideas: `💡 **Creative Content Ideas:**

1. **"Behind the Scenes"** - Show your process
2. **"Tips & Tricks"** - Share your expertise
3. **"Story Time"** - Personal experiences and lessons
4. **"Q&A Sessions"** - Answer audience questions
5. **"Tutorials"** - Step-by-step guides
6. **"Reviews & Recommendations"** - Product or service reviews
7. **"Industry Insights"** - Share market knowledge
8. **"Team Spotlights"** - Highlight team members
9. **"User-Generated Content"** - Feature customer stories
10. **"Seasonal Content"** - Holiday and event-related posts

🚀 **Bonus:** Create series content for better engagement!`,

      engagement: `🤝 **Audience Engagement Strategies:**

**Build Connection:**
✅ Respond to all comments and messages
✅ Ask questions in your content
✅ Share personal stories and experiences
✅ Create interactive content (polls, quizzes)
✅ Show appreciation for your community

**Best Practices:**
💬 Reply within 2-4 hours when possible
❤️ Like and heart comments to show appreciation
🎯 Create content that sparks conversation
📱 Use clear calls-to-action
🔄 Share user-generated content

**Community Building:**
👥 Create a hashtag for your community
🎉 Celebrate milestones together
💡 Ask for feedback and suggestions`
    };

    if (message.toLowerCase().includes('strategy')) return responses.strategy;
    if (
      message.toLowerCase().includes('planning') ||
      message.toLowerCase().includes('calendar')
    )
      return responses.planning;
    if (
      message.toLowerCase().includes('idea') ||
      message.toLowerCase().includes('creative')
    )
      return responses.ideas;
    if (
      message.toLowerCase().includes('engagement') ||
      message.toLowerCase().includes('audience')
    )
      return responses.engagement;

    return `🤖 I'd be happy to help you with content creation! Here are some areas I can assist with:

🎯 **Content Strategy** - Planning and goal-setting
📅 **Content Planning** - Organization and scheduling
💡 **Creative Ideas** - Brainstorming and inspiration
🤝 **Audience Engagement** - Building community and connection

What specific area would you like to dive into?`;
  };

  const getCardSize = () => {
    if (isMinimized) return 'h-16';
    if (isExpanded) return 'h-[600px] w-full sm:w-96 max-w-md';
    return 'h-[480px] w-full sm:w-80 max-w-sm';
  };

  const getContentHeight = () => {
    if (isExpanded) return 'h-[520px]';
    return 'h-[400px]';
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <BotIcon className="h-5 w-5 mr-2" />
          Content Assistant
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`transition-all duration-300 ease-in-out ${getCardSize()} shadow-xl border-2`}
      >
        {/* Header */}
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <BotIcon className="h-5 w-5 mr-2" />
              {isMinimized ? 'Assistant' : 'Content Assistant'}
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isMinimized ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <MinusIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <Minimize2Icon className="h-4 w-4" />
                ) : (
                  <MaximizeIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col">
            {/* Messages */}
            <div
              className={`flex-1 overflow-y-auto p-4 space-y-4 ${getContentHeight()}`}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            {showQuickPrompts && messages.length <= 1 && (
              <div className="border-t p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-600">
                    Quick Actions
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuickPrompts(false)}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDownIcon className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickPrompt(prompt.prompt)}
                      className="text-xs h-auto p-2 flex flex-col items-center space-y-1"
                    >
                      <prompt.icon className="h-3 w-3" />
                      <span>{prompt.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about content..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="sm"
                  className="px-3"
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
