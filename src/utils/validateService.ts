import type { FormValuesService } from "../types/Service";
import { ServiceErrors } from "../types/Service";

export function validateService(form: FormValuesService): ServiceErrors {
  const errs: ServiceErrors = {};
  if (!form.description.trim()) {
    errs.description = "Обязательное поле";
  }
  if (!form.city) {
    errs.city = "Обязательное поле";
  }
  const addrErrs = form.addresses.map(
    () => ({} as { city?: string; street?: string })
  );
  form.addresses.forEach((a, i) => {
    if (!a.city) {
      addrErrs[i].city = "Укажите город";
    }
    if (!a.street.trim()) {
      addrErrs[i].street = "Укажите адрес";
    }
  });
  if (addrErrs.some((e) => e.city || e.street)) {
    errs.addresses = addrErrs;
  }

  if (!form.contactMethod) {
    errs.contactMethod = "Обязательное поле";
  }
  if (form.budget === "" || form.budget == null) {
    errs.budget = "Обязательное поле";
  } else if (isNaN(Number(form.budget))) {
    errs.budget = "Нужно число";
  } else if (Number(form.budget) < 0) {
    errs.budget = "Значение не может быть отрицательным";
  }
  if (!form.budgetType) {
    errs.budgetType = "Обязательное поле";
  }
  return errs;
}
