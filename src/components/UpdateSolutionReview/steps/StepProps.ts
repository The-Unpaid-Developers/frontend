import { ErrorType } from "../../types/errors";

// export type StepProps<T = any> = {
//   onSave: (data: T) => Promise<void> | void;
//   isSaving?: boolean;
//   initialData?: T | undefined;
// };
export interface StepProps {
  onSave: (data: any) => Promise<void> | void;
  isSaving?: boolean;
  initialData: any;
  showSuccess?: (message: string) => void;
  showError?: (message: string) => void;
}