import { StockAsset } from '../types';

export const STOCK_VIDEOS: StockAsset[] = [
  {
    id: 'vid-cyberpunk',
    name: 'Neon Cyberpunk Street',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-43952-large.mp4',
    duration: 10,
    category: 'Sci-Fi',
    color: '#EC4899',
    style: 'linear-gradient(135deg, #111827 0%, #311042 50%, #ec4899 100%)'
  },
  {
    id: 'vid-ocean',
    name: 'Serene Ocean Waves',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-foam-of-the-ocean-waves-42171-large.mp4',
    duration: 8,
    category: 'Nature',
    color: '#0EA5E9',
    style: 'linear-gradient(180deg, #0284c7 0%, #0369a1 50%, #075985 100%)'
  },
  {
    id: 'vid-abstract',
    name: 'Abstract Liquid Fluid',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-acrylic-paint-swirling-underwater-43301-large.mp4',
    duration: 12,
    category: 'Creative',
    color: '#A855F7',
    style: 'linear-gradient(225deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)'
  },
  {
    id: 'vid-space',
    name: 'Deep Space Nebula',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-galaxy-in-deep-space-32731-large.mp4',
    duration: 15,
    category: 'Cosmic',
    color: '#6366F1',
    style: 'linear-gradient(120deg, #09090e 0%, #1e1b4b 40%, #4338ca 100%)'
  }
];

export const STOCK_PHOTOS: StockAsset[] = [
  {
    id: 'img-sunset',
    name: 'Retro Sunset Boulevard',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    duration: 5,
    category: 'Scenic',
    color: '#F97316'
  },
  {
    id: 'img-mountain',
    name: 'Misty Mountains Peak',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    duration: 5,
    category: 'Scenic',
    color: '#10B981'
  },
  {
    id: 'img-workspace',
    name: 'Minimalist Desk Setup',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    duration: 5,
    category: 'Modern',
    color: '#64748B'
  },
  {
    id: 'img-arcade',
    name: '80s Arcade Glow',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    duration: 5,
    category: 'Vibrant',
    color: '#EF4444'
  }
];

export const STOCK_AUDIO: StockAsset[] = [
  {
    id: 'aud-lofi',
    name: 'Lofi Midnight Rain',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Stable public MP3
    duration: 372,
    category: 'Chill'
  },
  {
    id: 'aud-synthwave',
    name: 'Synthwave Neon Horizon',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 423,
    category: 'Energetic'
  },
  {
    id: 'aud-nature',
    name: 'Gentle River & Birds',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 302,
    category: 'Atmospheric'
  }
];
