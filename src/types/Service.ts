export interface Address { city: string; street: string };

export interface FormValuesService {
  description: string;
  city: string;
  addresses: Address[];
  contactMethod: string;
  budget: string;
  budgetType: string;
  requirementsConfirmed: boolean;
  requirementsWithPhotos: boolean;
  requirementsWithReviews: boolean;
};


export type ServiceErrors = {
  description?: string;
  city?: string;
  addresses?: { city?: string; street?: string }[];
  contactMethod?: string;
  budget?: string;
  budgetType?: string;
};