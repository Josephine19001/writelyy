// TEMPORARILY DISABLED - This component is not currently in use

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
import { Input } from '@ui/components/input';
import {
  SearchIcon,
  FolderIcon,
  TagIcon,
  CalendarIcon,
  MessageSquareIcon,
  DownloadIcon,
  ShareIcon,
  TrashIcon,
  FilterIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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

export function ChatLibrary() {
  const t = useTranslations();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'hooks' | 'content'
  >('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  const [savedChats] = useState<SavedChat[]>([
    {
      id: '1',
      title: 'Engaging Content Hooks for Product Launch',
      category: 'hooks',
      messages: [
        {
          id: '1',
          role: 'user',
          content:
            'Give me 10 engaging hooks for promoting a new product launch',
          timestamp: new Date('2024-01-15')
        },
        {
          id: '2',
          role: 'assistant',
          content:
            'Here are 10 engaging hooks for your product launch:\n\n1. "This just changed everything we thought we knew about..."\n2. "POV: You discover a solution that actually works"\n3. "Stop spending hours on what this can do in minutes"\n4. "The tool that made our team 10x more productive"\n5. "If you\'re not using this approach, you\'re missing out"',
          timestamp: new Date('2024-01-15')
        }
      ],
      tags: ['hooks', 'product-launch', 'marketing', 'engagement'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
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
          timestamp: new Date('2024-01-14')
        },
        {
          id: '2',
          role: 'assistant',
          content:
            'Here are effective content formats for business growth:\n\n📚 Educational tutorials and how-tos\n🎯 Problem/Solution case studies\n📊 Before/After transformations\n🤝 Behind the scenes content\n💡 Tips and best practices',
          timestamp: new Date('2024-01-14')
        }
      ],
      tags: ['content-strategy', 'business', 'growth', 'education'],
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14')
    },
    {
      id: '3',
      title: 'Compelling Headlines and Titles',
      category: 'hooks',
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'Create compelling headlines for productivity content',
          timestamp: new Date('2024-01-13')
        }
      ],
      tags: ['headlines', 'productivity', 'copywriting'],
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13')
    },
    {
      id: '4',
      title: 'Marketing Copy Templates',
      category: 'content',
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'Help me write marketing copy for an online course launch',
          timestamp: new Date('2024-01-12')
        }
      ],
      tags: ['marketing', 'copywriting', 'course-launch', 'templates'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    }
  ]);

  // Get all unique tags
  const allTags = Array.from(new Set(savedChats.flatMap((chat) => chat.tags)));

  // Filter and sort chats
  const filteredChats = savedChats
    .filter((chat) => {
      const matchesSearch =
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === 'all' || chat.category === selectedCategory;
      const matchesTag = !selectedTag || chat.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const exportChat = (chat: SavedChat) => {
    const content = {
      title: chat.title,
      category: chat.category,
      tags: chat.tags,
      conversation: chat.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      })),
      createdAt: chat.createdAt.toISOString()
    };

    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyChat = (chat: SavedChat) => {
    const text = chat.messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Chat Library</h2>
        <p className="text-muted-foreground">
          Your saved conversations organized by hooks and content ideas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Chats</p>
                <p className="text-2xl font-bold">{savedChats.length}</p>
              </div>
              <MessageSquareIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hook Ideas</p>
                <p className="text-2xl font-bold">
                  {savedChats.filter((c) => c.category === 'hooks').length}
                </p>
              </div>
              <TagIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Content Ideas</p>
                <p className="text-2xl font-bold">
                  {savedChats.filter((c) => c.category === 'content').length}
                </p>
              </div>
              <FolderIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Tags</p>
                <p className="text-2xl font-bold">{allTags.length}</p>
              </div>
              <FilterIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All ({savedChats.length})
            </Button>
            <Button
              variant={selectedCategory === 'hooks' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('hooks')}
            >
              Hooks ({savedChats.filter((c) => c.category === 'hooks').length})
            </Button>
            <Button
              variant={selectedCategory === 'content' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('content')}
            >
              Content (
              {savedChats.filter((c) => c.category === 'content').length})
            </Button>
          </div>

          {/* Tag Filter */}
          <div className="flex gap-1 flex-wrap">
            {selectedTag && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTag('')}
                className="gap-1"
              >
                #{selectedTag} ×
              </Button>
            )}
            {allTags.slice(0, 10).map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className="text-xs"
              >
                #{tag}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button
              variant={sortBy === 'newest' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('newest')}
            >
              Newest
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('oldest')}
            >
              Oldest
            </Button>
            <Button
              variant={sortBy === 'title' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('title')}
            >
              Title
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredChats.map((chat) => (
          <Card
            key={chat.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{chat.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      status={chat.category === 'hooks' ? 'success' : 'info'}
                    >
                      {chat.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {chat.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyChat(chat);
                    }}
                  >
                    <ShareIcon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportChat(chat);
                    }}
                  >
                    <DownloadIcon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Preview */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {chat.messages[0]?.content}
                </p>

                {/* Tags */}
                <div className="flex gap-1 flex-wrap">
                  {chat.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-secondary px-2 py-1 rounded cursor-pointer hover:bg-secondary/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag(tag);
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                  {chat.tags.length > 4 && (
                    <span className="text-xs text-muted-foreground px-2 py-1">
                      +{chat.tags.length - 4} more
                    </span>
                  )}
                </div>

                {/* Message count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {chat.messages.length} messages
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Updated {chat.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChats.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No chats found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms or filters, or start a new
              conversation with the AI assistant.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
