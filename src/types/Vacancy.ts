export interface Address {
  city: string;
  street: string;
}

export interface FormValuesVacancy {
  title: string;
  description: string;
  city: string;
  addresses: Address[];
  salaryFrom: string;
  salaryTo: string;
  experience: string;
}

export type VacancyErrors = {
  title?: string;
  description?: string;
  city?: string;
  addresses?: { city?: string; street?: string }[];
  salaryFrom?: string;
  salaryTo?: string;
  experience?: string;
};
