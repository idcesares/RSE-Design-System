export type MotionSetting = 'full' | 'reduced';

export interface RSEMotion {
  /** Current setting: the one applied, else the stored choice, else the OS preference. */
  get(): MotionSetting;
  /** Store the choice and set data-rse-motion on <html>. */
  set(value: MotionSetting): void;
  /** Apply the stored choice, else the OS preference, else 'full'. Returns what it applied. */
  init(): MotionSetting;
  /**
   * Scroll-triggered reveal for MotifPattern: marks each `.rse-motif-pattern[data-animate="reveal"]` in
   * `root` (or `root` itself) `data-reveal-ready`, then adds `.is-visible` once when it enters the
   * viewport. Without IntersectionObserver it does nothing, so the pattern is never hidden.
   */
  reveal(root?: ParentNode): void;
  /** Binds the delegated click handler for `.rse-motif-pattern__pause` buttons. Called once at load; calling it again does nothing. */
  bindPause(): void;
}

declare global {
  interface Window {
    RSE: { motion: RSEMotion; [component: string]: unknown };
  }
}
