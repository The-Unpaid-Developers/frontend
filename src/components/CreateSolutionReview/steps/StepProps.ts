export type StepProps<T = any> = {
  onSave: (data: T) => Promise<void> | void;
  isSaving?: boolean;
  initialData?: T | undefined;
};