export interface Project {
  id: string;
  title: string;
  description: string;
  duration_seconds: number;
  created_at: string;
  metadata: {
    clipCount: number;
    audioCount: number;
    textCount: number;
  };
}

export type MediaType = 'video' | 'photo' | 'image';

export interface Clip {
  id: string;
  project_id: string;
  media_path: string; // can be blob URL or stock ID or external URL
  media_type: MediaType;
  name: string;
  start_time: number;
  duration: number;
  position_index: number;
  transition_type: 'none' | 'fade' | 'slide' | 'zoom' | 'wipe' | 'dissolve';
  transition_duration: number;
  thumbnail_url?: string;
}

export interface AudioTrack {
  id: string;
  project_id: string;
  audio_path: string; // can be blob URL or stock ID
  track_name: string;
  start_time: number;
  volume: number; // 0.0 to 1.0
  duration: number;
}

export interface TextOverlay {
  id: string;
  project_id: string;
  text_content: string;
  effect_type: 'fadein' | 'slide' | 'bounce' | 'typewriter' | 'zoom';
  color: string;
  font_size: number;
  duration: number;
  start_time: number;
  position_x: number; // percentage 0-1
  position_y: number; // percentage 0-1
}

export interface StockAsset {
  id: string;
  name: string;
  type: 'video' | 'photo' | 'audio';
  url: string;
  duration: number;
  category: string;
  color?: string; // used for visually stunning CSS abstract render fallbacks
  style?: string; // e.g. for CSS animations or abstract artwork rendering
}
