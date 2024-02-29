export type MachineParams<A extends Record<string, Record<string, any>>> =
  keyof A extends infer Type
  ? Type extends keyof A
  ? keyof A[Type] extends ""
  ? { readonly type: Type }
  : { readonly type: Type; readonly params: A[Type] }
  : never
  : never;


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
