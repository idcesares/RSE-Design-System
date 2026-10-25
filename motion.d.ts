export type MotionSetting = 'full' | 'reduced';

export interface RSEMotion {
  /** Current setting: the one applied, else the stored choice, else the OS preference. */
  get(): MotionSetting;
  /** Store the choice and set data-rse-motion on <html>. */
  set(value: MotionSetting): void;
  /** Apply the stored choice, else the OS preference, else 'full'. Returns what it applied. */
  init(): MotionSetting;
}

declare global {
  interface Window {
    RSE: { motion: RSEMotion; [component: string]: unknown };
  }
}
