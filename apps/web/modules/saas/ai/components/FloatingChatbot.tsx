// TEMPORARILY DISABLED - This component is commented out in SidebarContentLayout.tsx

'use client';

import { Button } from '@ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@ui/components/card';
import { Badge } from '@ui/components/badge';
import { Textarea } from '@ui/components/textarea';
import { Input } from '@ui/components/input';
import { Label } from '@ui/components/label';
import {
  BotIcon,
  MessageSquareIcon,
  SendIcon,
  XIcon,
  MinusIcon,
  MaximizeIcon,
  BookmarkIcon,
  SparklesIcon,
  UserIcon,
  FolderIcon,
  TagIcon,
  CopyIcon,
  DownloadIcon,
  RefreshCwIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface SavedChat {
  id: string;
  title: string;
  category: 'hooks' | 'content';
  messages: ChatMessage[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  title?: string;
}

export function FloatingChatbot() {
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'library'>('chat');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveForm, setSaveForm] = useState({
    title: '',
    category: 'content' as 'hooks' | 'content',
    tags: [] as string[],
    tagInput: ''
  });

  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: '1',
    messages: []
  });

  const [savedChats, setSavedChats] = useState<SavedChat[]>([
    {
      id: '1',
      title: 'Engaging Content Hooks for Products',
      category: 'hooks',
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'Give me 10 engaging hooks for promoting a new product',
          timestamp: new Date()
        },
        {
          id: '2',
          role: 'assistant',
          content:
            'Here are 10 engaging hooks for your product:\n\n1. "This just replaced our entire workflow..."\n2. "POV: You discover a solution that actually works"\n3. "Stop spending hours on what this can do in minutes"\n4. "The tool that made our team think differently"\n5. "If you\'re not using this approach, you\'re missing out"\n\n[... and 5 more]',
          timestamp: new Date()
        }
      ],
      tags: ['hooks', 'product', 'marketing', 'engagement'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Content Ideas for Business Growth',
      category: 'content',
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'What are effective content formats for business growth?',
          timestamp: new Date()
        }
      ],
      tags: ['content-strategy', 'business', 'growth'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages]);

  const sendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentInput,
      role: 'user',
      timestamp: new Date()
    };

    setCurrentSession((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setCurrentInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(currentInput),
        role: 'assistant',
        timestamp: new Date()
      };

      setCurrentSession((prev) => ({
        ...prev,
        messages: [...prev.messages, aiResponse]
      }));

      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    // Simple response generation based on keywords
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('hook') || lowerInput.includes('caption')) {
      return 'Here are some engaging hooks for your content:\n\n• "POV: You just discovered the secret to..."\n• "Tell me you\'re [target audience] without telling me..."\n• "The difference between successful businesses and everyone else..."\n• "What I wish I knew before starting..."\n• "Plot twist: This method actually works..."\n\nWould you like me to customize these for a specific audience or niche?';
    }

    if (lowerInput.includes('content') || lowerInput.includes('post')) {
      return 'Great content ideas for your business:\n\n📱 **Content Types:**\n• Behind-the-scenes content\n• Educational tutorials\n• Customer success stories\n• Industry insights\n• Quick tips and tutorials\n\n🎯 **Engagement Strategies:**\n• Ask questions to your audience\n• Share valuable insights\n• Tell relatable stories\n• Showcase transformations\n\nWhat type of content are you focusing on? I can provide more specific suggestions!';
    }

    if (lowerInput.includes('strategy') || lowerInput.includes('plan')) {
      return "Here's a strategic content approach:\n\n🔥 **Content Pillars:**\n• Educational content (40%)\n• Behind-the-scenes (20%)\n• Customer stories (20%)\n• Industry insights (20%)\n\n📈 **Content Planning:**\n• Weekly content themes\n• Consistent posting schedule\n• Mix of formats (text, images, videos)\n• Community engagement focus\n\n💡 **Growth Strategy:**\nFocus on providing value first, building relationships, and establishing authority in your niche.";
    }

    return "I'd be happy to help you with content creation! I can assist with:\n\n• Writing engaging hooks and copy\n• Brainstorming content ideas\n• Developing content strategies\n• Creating content calendars\n• Building product voice\n• Analyzing market trends\n\nWhat specific area would you like to focus on?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const saveChat = () => {
    if (!saveForm.title.trim() || currentSession.messages.length === 0) return;

    const newSavedChat: SavedChat = {
      id: Date.now().toString(),
      title: saveForm.title,
      category: saveForm.category,
      messages: currentSession.messages,
      tags: saveForm.tags,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSavedChats((prev) => [newSavedChat, ...prev]);

    // Reset form and close dialog
    setSaveForm({
      title: '',
      category: 'content',
      tags: [],
      tagInput: ''
    });
    setShowSaveDialog(false);
  };

  const addTag = () => {
    if (
      saveForm.tagInput.trim() &&
      !saveForm.tags.includes(saveForm.tagInput.trim())
    ) {
      setSaveForm((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }));
    }
  };

  const removeTag = (tag: string) => {
    setSaveForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag)
    }));
  };

  const loadSavedChat = (chat: SavedChat) => {
    setCurrentSession({
      id: chat.id,
      messages: chat.messages,
      title: chat.title
    });
    setActiveTab('chat');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const newChat = () => {
    setCurrentSession({
      id: Date.now().toString(),
      messages: [],
      title: undefined
    });
    setActiveTab('chat');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground z-50 p-0 transition-all duration-200 hover:scale-105"
        size="icon"
      >
        <BotIcon className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 shadow-2xl border z-50 transition-all duration-300 ${
        isMinimized ? 'h-14 w-80' : 'h-[600px] w-96'
      }`}
    >
      {/* Header */}
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BotIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">AI Content Assistant</CardTitle>
            {currentSession.title && (
              <Badge status="info" className="text-xs">
                {currentSession.title}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? (
                <MaximizeIcon className="h-4 w-4" />
              ) : (
                <MinusIcon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant={activeTab === 'chat' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquareIcon className="h-3 w-3 mr-1" />
              Chat
            </Button>
            <Button
              variant={activeTab === 'library' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('library')}
            >
              <FolderIcon className="h-3 w-3 mr-1" />
              Library
            </Button>
            <Button variant="ghost" size="sm" onClick={newChat}>
              <RefreshCwIcon className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-4 pt-0 flex flex-col h-full">
          {activeTab === 'chat' ? (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
                {currentSession.messages.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <BotIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium mb-1">
                      AI Content Assistant
                    </p>
                    <p className="text-xs">
                      Ask me about hooks, captions, hashtags, and content ideas
                    </p>
                  </div>
                ) : (
                  currentSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-primary'
                            : 'bg-secondary'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <UserIcon className="h-3 w-3 text-primary-foreground" />
                        ) : (
                          <BotIcon className="h-3 w-3 text-secondary-foreground" />
                        )}
                      </div>
                      <div
                        className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                      >
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {message.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.content)}
                              className="h-6 px-2"
                            >
                              <CopyIcon className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                      <BotIcon className="h-3 w-3 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="p-3 rounded-lg bg-secondary text-secondary-foreground">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Actions */}
              {currentSession.messages.length > 0 && (
                <div className="flex gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSaveDialog(true)}
                    className="gap-1"
                  >
                    <BookmarkIcon className="h-3 w-3" />
                    Save
                  </Button>
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about content ideas, hooks, captions..."
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!currentInput.trim() || isLoading}
                  size="sm"
                  className="self-end"
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            /* Library Tab */
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FolderIcon className="h-4 w-4" />
                  <span className="font-medium">Recent Conversations</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('/app/chat-library', '_blank')}
                  className="text-xs"
                >
                  View All
                </Button>
              </div>

              {/* Recent Saved Chats List */}
              <div className="space-y-3">
                {savedChats.slice(0, 4).map((chat) => (
                  <div
                    key={chat.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-secondary/50"
                    onClick={() => loadSavedChat(chat)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        loadSavedChat(chat);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {chat.title}
                      </h4>
                      <Badge
                        status={chat.category === 'hooks' ? 'success' : 'info'}
                        className="text-xs"
                      >
                        {chat.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {chat.messages[0]?.content.slice(0, 60)}...
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {chat.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-secondary px-1 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {chat.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{chat.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {savedChats.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <FolderIcon className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No saved conversations yet</p>
                  <p className="text-xs">
                    Start chatting and save valuable conversations
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Save Dialog */}
          {showSaveDialog && (
            <div className="absolute inset-0 bg-background/95 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Save Conversation</h3>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={saveForm.title}
                    onChange={(e) =>
                      setSaveForm((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                    placeholder="Give this conversation a title..."
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={
                        saveForm.category === 'hooks' ? 'primary' : 'outline'
                      }
                      size="sm"
                      onClick={() =>
                        setSaveForm((prev) => ({ ...prev, category: 'hooks' }))
                      }
                    >
                      Hooks
                    </Button>
                    <Button
                      variant={
                        saveForm.category === 'content' ? 'primary' : 'outline'
                      }
                      size="sm"
                      onClick={() =>
                        setSaveForm((prev) => ({
                          ...prev,
                          category: 'content'
                        }))
                      }
                    >
                      Content
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={saveForm.tagInput}
                      onChange={(e) =>
                        setSaveForm((prev) => ({
                          ...prev,
                          tagInput: e.target.value
                        }))
                      }
                      placeholder="Add tags..."
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button size="sm" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {saveForm.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-secondary px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        #{tag} <XIcon className="h-3 w-3" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveChat} className="flex-1">
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
