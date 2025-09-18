export interface StepProps {
  onSave: (data: any) => Promise<void> | void;
  isSaving?: boolean;
  initialData: any;
  showSuccess?: (message: string) => void;
  showError?: (message: string) => void;
}