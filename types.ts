export enum AppView {
  LANDING = 'LANDING',
  APP_SELECTION = 'APP_SELECTION',
  TEXT_CHAT = 'TEXT_CHAT',
  VOICE_CHAT = 'VOICE_CHAT',
  ANALYTICS = 'ANALYTICS',
  ABOUT = 'ABOUT'
}

export enum Sender {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: Sender;
  text: string;
  timestamp: Date;
}

export interface Interaction {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  source: 'text' | 'voice';
}

export interface AudioContextState {
    isRecording: boolean;
    isConnected: boolean;
    volume: number;
}