import {
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  XIcon,
  RedditIcon
} from '@saas/shared/components/SocialIcons';

// Platform type with all supported platforms
export type Platform = 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE' | 'X' | 'REDDIT';

// Platform configuration interface
export interface PlatformConfig {
  key: Platform;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  colors: string;
  urlPatterns: string[];
  displayName: string;
}

// Centralized platform configurations
export const PLATFORMS: Record<Platform, PlatformConfig> = {
  TIKTOK: {
    key: 'TIKTOK',
    icon: TikTokIcon,
    label: 'TikTok',
    colors: 'bg-black text-white',
    urlPatterns: ['tiktok.com'],
    displayName: 'TikTok'
  },
  INSTAGRAM: {
    key: 'INSTAGRAM',
    icon: InstagramIcon,
    label: 'Instagram',
    colors: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    urlPatterns: ['instagram.com'],
    displayName: 'Instagram'
  },
  YOUTUBE: {
    key: 'YOUTUBE',
    icon: YouTubeIcon,
    label: 'YouTube',
    colors: 'bg-red-600 text-white',
    urlPatterns: ['youtube.com', 'youtu.be'],
    displayName: 'YouTube'
  },
  X: {
    key: 'X',
    icon: XIcon,
    label: 'X',
    colors: 'bg-gray-900 text-white',
    urlPatterns: ['x.com', 'twitter.com'],
    displayName: 'X (Twitter)'
  },
  REDDIT: {
    key: 'REDDIT',
    icon: RedditIcon,
    label: 'Reddit',
    colors: 'bg-orange-600 text-white',
    urlPatterns: ['reddit.com'],
    displayName: 'Reddit'
  }
};

// Platform arrays for different use cases
export const ALL_PLATFORMS = Object.values(PLATFORMS);
export const PLATFORM_KEYS = Object.keys(PLATFORMS) as Platform[];

// Helper functions
export const getPlatformConfig = (platform: Platform): PlatformConfig => {
  return PLATFORMS[platform];
};

export const getPlatformIcon = (platform: Platform) => {
  return PLATFORMS[platform]?.icon || null;
};

export const getPlatformLabel = (platform: Platform): string => {
  return PLATFORMS[platform]?.label || platform;
};

export const getPlatformDisplayName = (platform: Platform): string => {
  return PLATFORMS[platform]?.displayName || platform;
};

export const getPlatformColors = (platform: Platform): string => {
  return PLATFORMS[platform]?.colors || 'bg-gray-500 text-white';
};

// Auto-detect platform from URL
export const detectPlatformFromUrl = (url: string): Platform | '' => {
  if (!url) {
    return '';
  }

  const urlLower = url.toLowerCase();

  for (const platform of ALL_PLATFORMS) {
    if (platform.urlPatterns.some((pattern) => urlLower.includes(pattern))) {
      return platform.key;
    }
  }

  return '';
};

// Get platforms for select options
export const getPlatformSelectOptions = (includeAll = true) => {
  const options = ALL_PLATFORMS.map((platform) => ({
    value: platform.key,
    label: platform.displayName,
    icon: platform.icon
  }));

  if (includeAll) {
    return [
      { value: 'all' as const, label: 'All Platforms', icon: null },
      ...options
    ];
  }

  return options;
};

// Platform validation
export const isValidPlatform = (platform: string): platform is Platform => {
  return PLATFORM_KEYS.includes(platform as Platform);
};
