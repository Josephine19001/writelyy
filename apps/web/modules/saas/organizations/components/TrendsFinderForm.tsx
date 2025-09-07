'use client';

import { useState } from 'react';
import { Button } from '@ui/components/button';
import { Input } from '@ui/components/input';
import { Label } from '@ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ui/components/select';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/card';
import { Badge } from '@ui/components/badge';
import {
  SearchIcon,
  TrendingUpIcon,
  MapPinIcon,
  UsersIcon,
  HashIcon,
  VideoIcon,
  TargetIcon,
  CalendarIcon,
  GlobeIcon
} from 'lucide-react';

interface TrendSearchParams {
  topic: string;
  keywords: string[];
  niche: string;
  demographic: string;
  industry: string;
  location: string;
  socialMedia: string[];
  contentType: string;
  timeframe: string;
  language: string;
}

interface TrendsFinderFormProps {
  onSearch: (params: TrendSearchParams) => void;
  isLoading?: boolean;
}

const NICHES = [
  'Beauty & Skincare',
  'Fitness & Health',
  'Technology',
  'Gaming',
  'Food & Cooking',
  'Fashion',
  'Travel',
  'DIY & Crafts',
  'Business & Finance',
  'Education',
  'Entertainment',
  'Sports',
  'Lifestyle',
  'Parenting',
  'Pets',
  'Music',
  'Art & Design',
  'Photography'
];

const DEMOGRAPHICS = [
  'Gen Z (18-24)',
  'Millennials (25-40)',
  'Gen X (41-56)',
  'Baby Boomers (57+)',
  'Teens (13-17)',
  'Young Adults (18-25)',
  'Adults (26-40)',
  'Middle-aged (41-55)',
  'Seniors (55+)'
];

const INDUSTRIES = [
  'E-commerce',
  'SaaS/Technology',
  'Healthcare',
  'Education',
  'Entertainment',
  'Finance',
  'Real Estate',
  'Automotive',
  'Food & Beverage',
  'Fashion & Beauty',
  'Travel & Tourism',
  'Sports & Fitness',
  'Home & Garden',
  'B2B Services',
  'Non-profit',
  'Government'
];

const SOCIAL_PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'instagram', label: 'Instagram', icon: '📷' },
  { id: 'youtube', label: 'YouTube', icon: '🎥' },
  { id: 'twitter', label: 'X (Twitter)', icon: '🐦' },
  { id: 'reddit', label: 'Reddit', icon: '🤖' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'pinterest', label: 'Pinterest', icon: '📌' },
  { id: 'snapchat', label: 'Snapchat', icon: '👻' }
];

const CONTENT_TYPES = [
  'Video',
  'Image/Photo',
  'Carousel',
  'Stories',
  'Reels/Shorts',
  'Live Streams',
  'Text Posts',
  'Polls',
  'Music/Audio',
  'User-Generated Content'
];

const TIMEFRAMES = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last Year' }
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ru', label: 'Russian' }
];

export function TrendsFinderForm({
  onSearch,
  isLoading = false
}: TrendsFinderFormProps) {
  const [formData, setFormData] = useState<TrendSearchParams>({
    topic: '',
    keywords: [],
    niche: '',
    demographic: '',
    industry: '',
    location: '',
    socialMedia: ['tiktok'],
    contentType: '',
    timeframe: '30d',
    language: 'en'
  });

  const [keywordInput, setKeywordInput] = useState('');

  const handleAddKeyword = () => {
    if (
      keywordInput.trim() &&
      !formData.keywords.includes(keywordInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword)
    }));
  };

  const handlePlatformToggle = (platformId: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.includes(platformId)
        ? prev.socialMedia.filter((p) => p !== platformId)
        : [...prev.socialMedia, platformId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="h-5 w-5" />
          Topic Research
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Win your readers' hearts and minds with a topic finder that helps you
          generate ideas for engaging content
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Topic & Keywords */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                1
              </span>
              Enter a topic
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="topic">Describe your topic in 1-3 words</Label>
                <div className="relative mt-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="topic"
                    placeholder="e.g., vegan recipes"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        topic: e.target.value
                      }))
                    }
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  • Choose words broad enough to capture a range of subtopics
                  (e.g. "vegan recipes")
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">Related Keywords (Optional)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="keywords"
                    placeholder="Add related keywords..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddKeyword}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveKeyword(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Targeting */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                2
              </span>
              Target Your Audience
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="niche" className="flex items-center gap-2">
                  <HashIcon className="h-4 w-4" />
                  Niche
                </Label>
                <Select
                  value={formData.niche}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, niche: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="demographic"
                  className="flex items-center gap-2"
                >
                  <UsersIcon className="h-4 w-4" />
                  Demographic
                </Label>
                <Select
                  value={formData.demographic}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, demographic: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target demographic" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMOGRAPHICS.map((demo) => (
                      <SelectItem key={demo} value={demo}>
                        {demo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry" className="flex items-center gap-2">
                  <TargetIcon className="h-4 w-4" />
                  Industry
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, industry: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Location
                </Label>
                <div className="flex gap-2">
                  <Select value="US" onValueChange={() => {}}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">🇺🇸 US</SelectItem>
                      <SelectItem value="GB">🇬🇧 UK</SelectItem>
                      <SelectItem value="CA">🇨🇦 CA</SelectItem>
                      <SelectItem value="AU">🇦🇺 AU</SelectItem>
                      <SelectItem value="DE">🇩🇪 DE</SelectItem>
                      <SelectItem value="FR">🇫🇷 FR</SelectItem>
                      <SelectItem value="ES">🇪🇸 ES</SelectItem>
                      <SelectItem value="IT">🇮🇹 IT</SelectItem>
                      <SelectItem value="BR">🇧🇷 BR</SelectItem>
                      <SelectItem value="JP">🇯🇵 JP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="City, State, or Region"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value
                      }))
                    }
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  • Set a location and language to keep results targeted
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Platform & Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                3
              </span>
              Platform & Content Type
            </div>

            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <GlobeIcon className="h-4 w-4" />
                  Social Media Platforms
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <Button
                      key={platform.id}
                      type="button"
                      variant={
                        formData.socialMedia.includes(platform.id)
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => handlePlatformToggle(platform.id)}
                      className="justify-start gap-2"
                    >
                      <span>{platform.icon}</span>
                      {platform.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="contentType"
                    className="flex items-center gap-2"
                  >
                    <VideoIcon className="h-4 w-4" />
                    Content Type
                  </Label>
                  <Select
                    value={formData.contentType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, contentType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All content types" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="timeframe"
                    className="flex items-center gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Timeframe
                  </Label>
                  <Select
                    value={formData.timeframe}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, timeframe: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEFRAMES.map((timeframe) => (
                        <SelectItem
                          key={timeframe.value}
                          value={timeframe.value}
                        >
                          {timeframe.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language" className="flex items-center gap-2">
                    <GlobeIcon className="h-4 w-4" />
                    Language
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={!formData.topic || isLoading}
              className="bg-green-600 hover:bg-green-700 min-w-[180px]"
            >
              {isLoading ? (
                <>Loading...</>
              ) : (
                <>
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Get Content Ideas
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
