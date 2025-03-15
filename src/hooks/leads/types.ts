
export interface PurchaseLeadOptions {
  projectId: string;
  projectTitle?: string;
  message?: string;
}

export interface PurchaseLeadResult {
  success: boolean;
  message: string;
}
