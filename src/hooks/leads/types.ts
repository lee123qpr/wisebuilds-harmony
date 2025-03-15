
export interface PurchaseLeadOptions {
  projectId: string;
  projectTitle?: string;
  message?: string;
  projectDetails?: {
    title?: string;
    budget?: string;
    duration?: string;
    hiring_status?: string;
    [key: string]: any;
  };
}

export interface PurchaseLeadResult {
  success: boolean;
  message: string;
}
