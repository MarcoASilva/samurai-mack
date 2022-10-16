export interface Timer {
  roundTime: number;
  timerElement: HTMLDivElement;
  run(): Promise<void>;
  stop(): void;
}
