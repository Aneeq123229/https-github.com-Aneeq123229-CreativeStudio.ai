export enum ToolType {
  LOGO = 'LOGO',
  THUMBNAIL = 'THUMBNAIL',
  SONG = 'SONG',
  AD = 'AD'
}

export interface GeneratedContent {
  type: 'image' | 'text' | 'audio' | 'mixed';
  imageUrl?: string;
  text?: string;
  audioData?: string; // Base64
  headline?: string;
  bodyCopy?: string;
}

export interface ToolConfig {
  id: ToolType;
  name: string;
  description: string;
  icon: string;
}
