export interface FilterChipOption {
  /** Value stored in the selection array */
  id: string;
  label: string;
  /** Optional result count shown inside the chip */
  count?: number;
}
export interface FilterChipsProps {
  /** Chip options — plain strings or objects with a count */
  options: (string | FilterChipOption)[];
  /** Selected ids */
  value?: string[];
  onChange?: (value: string[]) => void;
  /** Allow multiple selections (default true) */
  multiple?: boolean;
  /** Uppercase group label */
  label?: string;
  /** Show the Limpar reset link when anything is selected */
  showClear?: boolean;
}
/** Pill toggle group for filtering program, level and unit listings. Use above a results grid, never as a form field. */
export function FilterChips(props: FilterChipsProps): JSX.Element;
