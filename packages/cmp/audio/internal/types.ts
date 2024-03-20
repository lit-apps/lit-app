export interface PlayerI {
  get paused(): boolean;
  get speaking(): boolean;
  get ready(): boolean;
  get error(): string | undefined;
  play: () => void;
  pause: () => void;
  restart: () => void;
  dispose: () => void;
}

export interface SpeechConfigI {
  pitch: number;
  rate: number;
  language: string;
}
