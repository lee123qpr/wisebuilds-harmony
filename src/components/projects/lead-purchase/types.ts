
export interface LeadPurchaseButtonProps {
  projectId: string;
  projectTitle?: string;
  project?: any; // Full project details
  purchasesCount?: number;
  onPurchaseSuccess: () => void;
}
