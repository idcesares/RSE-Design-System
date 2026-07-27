export interface StepperStep {
  label: string;
  description?: string;
}
export interface StepperProps {
  /** Step labels, or objects with an optional description */
  steps: (string | StepperStep)[];
  /** Zero-based index of the current step; earlier steps render as complete */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  /** Makes step markers clickable (e.g. to revisit a completed step) */
  onStepClick?: (index: number) => void;
}
/** Progress indicator for multi-step flows: enrollment, document upload, application review. */
export function Stepper(props: StepperProps): JSX.Element;
