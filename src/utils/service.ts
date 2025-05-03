import type { FormValuesService } from "../types/Service";

type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never
}[keyof T];

type BooleanField = BooleanKeys<FormValuesService>;

type CheckboxOption = {
  name: BooleanField;
  label: string;
};


const checkboxOptions: CheckboxOption[] = [
  {
    name: "requirementsConfirmed",
    label: "Личность подтверждена",
  },
  {
    name: "requirementsWithPhotos",
    label: "С фото работ в анкете",
  },
  {
    name: "requirementsWithReviews",
    label: "С отзывами",
  },
];

export default checkboxOptions;