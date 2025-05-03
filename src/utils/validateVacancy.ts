import type { FormValuesVacancy } from "../types/Vacancy";
import type { VacancyErrors } from "../types/Vacancy";

export function validateVacancy(form: FormValuesVacancy): VacancyErrors {
  const errs: VacancyErrors = {};

  if (!form.title.trim()) {
    errs.title = "Обязательное поле";
  }
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

  if (form.salaryFrom == null) {
    errs.salaryFrom = "Обязательное поле";
  } else if (isNaN(Number(form.salaryFrom))) {
    errs.salaryFrom = "Нужно число";
  } else if (Number(form.salaryFrom) < 0) {
    errs.salaryFrom = "Значение не может быть отрицательным";
  }

  if (form.salaryTo == null) {
    errs.salaryTo = "Обязательное поле";
  } else if (isNaN(Number(form.salaryTo))) {
    errs.salaryTo = "Нужно число";
  } else if (form.salaryTo < form.salaryFrom) {
    errs.salaryTo = "Значение «до» не может быть меньше «от»";
  }

  if (!form.experience) {
    errs.experience = "Обязательное поле";
  }

  return errs;
}
