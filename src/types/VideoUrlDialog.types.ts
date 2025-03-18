export interface VideoUrlDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
} 