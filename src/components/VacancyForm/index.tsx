import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateVacancyField,
  updateVacancyAddress,
  removeVacancyAddress,
  addVacancyAddress,
  resetVacancyForm,
} from '../../store/vacancyFormSlice';
import type { Address } from '../../types/Vacancy';
import Modal from '../Modal/Modal';
import styles from '../FormCommon.module.scss';


import { VacancyErrors } from '../../types/Vacancy';
export default function VacancyForm() {

  const dispatch = useAppDispatch();
  const form = useAppSelector(s => s.vacancyForm);
  const [isModalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState<VacancyErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    dispatch(updateVacancyField({ [name]: name.includes('salary') ? Number(value) : value }));
  };
  const handleAddressChange = (
    id: number,
    field: keyof Address,
    value: string
  ) => {
    dispatch(
      updateVacancyAddress({ id, data: { ...form.addresses[id], [field]: value } })
    );
  };
  const closeModal = () => setModalOpen(false);

  const validate = (): boolean => {
    const errs: VacancyErrors = {};

    if (!form.title.trim()) {
      errs.title = 'Обязательное поле';
    }
    if (!form.description.trim()) {
      errs.description = 'Обязательное поле';
    }
    if (!form.city) {
      errs.city = 'Обязательное поле';
    }
    const addrErrs = form.addresses.map(() => ({} as { city?: string; detail?: string }));
    form.addresses.forEach((a, i) => {
      if (!a.city) addrErrs[i].city = 'Укажите город';
      if (!a.street.trim()) addrErrs[i].detail = 'Укажите адрес';
    });
    errs.addresses = addrErrs;

    if (form.salaryTo === '' || form.salaryTo === null || form.salaryTo === undefined) {
      errs.salaryTo = 'Обязательное поле';
    } else if (isNaN(Number(form.salaryTo))) {
      errs.salaryTo = 'Нужно число';
    } else if (Number(form.salaryTo) < 0) {
      errs.salaryTo = '>= 0';
    }

    if (
      errs.salaryFrom == null &&
      errs.salaryTo == null &&
      form.salaryTo < form.salaryFrom
    ) {
      errs.salaryTo = 'Должно быть ≥ От';
    }


    setErrors(errs);

    const hasError =
      !!errs.title ||
      !!errs.description ||
      !!errs.city ||
      errs.addresses.some((ae) => ae.city || ae.street) ||
      !!errs.salaryFrom ||
      !!errs.salaryTo ||
      !!errs.experience;

    return !hasError;
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log(form);
    dispatch(resetVacancyForm());
    setModalOpen(true);
  };

  return (
    <>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2>О заявке</h2>
        <div className={styles.formRow}>
          <label>Название вакансии:</label>
          <input name='title'
            value={form.title} onChange={handleChange} />
          {errors.title && <p className={styles.error}>{errors.title}</p>}

        </div>

        <div className={styles.formRow}>
          <label>Обязанности, требования, условия:</label>
          <textarea name='description'
            value={form.description} onChange={handleChange}
            style={{ maxWidth: "800px" }} />
          {errors.description && <p className={styles.error}>{errors.description}</p>}
        </div>

        <div className={styles.formRow}>
          <label>Город проживания:</label>
          <select name="city" value={form.city} onChange={handleChange}>
            <option value="">Город</option>
            <option value="Almaty">Алма-Ата</option>
            <option value="Astana">Астана</option>
          </select>
          {errors.city && <p className={styles.error}>{errors.city}</p>}

        </div>

        <div className={`${styles.formRow} ${styles.addresses}`}>
          <label>Адрес:</label>
          <div className={styles.addressList}>
            {form.addresses.map((addr, id) => (
              <div key={id} className={styles.addressRow}>
                <span>
                  <img src="/task-dual-forms/drag-handle.png" alt="drag-handle" width={16} height={16} />
                </span>
                <div className={styles.wrap}>
                  <select name="city" value={addr.city}
                    onChange={(e) => handleAddressChange(id, 'city', e.target.value)}
                  >
                    <option value="">Выберите...</option>
                    <option value="Almaty">Алма-Ата</option>
                    <option value="Astana">Астана</option>
                  </select>
                  {errors.addresses?.[id]?.city && (
                    <p className={styles.error}>
                      {errors.addresses[id]!.city}
                    </p>
                  )}
                  <input
                    name="street"
                    placeholder="Улица"
                    value={addr.street}
                    onChange={(e) => handleAddressChange(id, 'street', e.target.value)}
                  />
                  {errors.addresses?.[id]?.street && (
                    <p className={styles.error}>
                      {errors.addresses[id]!.street}
                    </p>
                  )}
                </div>
                <button type="button" onClick={() => dispatch(removeVacancyAddress(id))}>
                  <img src="/task-dual-forms/delete.svg" alt="delete" width={16} height={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addAddressBtn}
              onClick={() => dispatch(addVacancyAddress())}
              style={{ borderColor: '#0056b3' }}
            >
              Добавить ещё адрес
            </button>
          </div>
        </div>

        <div className={styles.formRow}>
          <label>Зарплата:</label>
          <div className={styles.inputWrap}>
            <input
              name="salaryFrom"
              type="number"
              placeholder="От"
              value={form.salaryFrom}
              onChange={handleChange}

            />
            {errors.salaryFrom && <p className={styles.error}>{errors.salaryFrom}</p>}
            <input
              name="salaryTo"
              type="number"
              placeholder="До"
              value={form.salaryTo}
              onChange={handleChange}
            />
            {errors.salaryTo && <p className={styles.error}>{errors.salaryTo}</p>}
          </div>

        </div>

        <div className={styles.formRow}>
          <label>Опыт работы:</label>
          <select name="experience" value={form.experience} onChange={handleChange}>
            <option value="">Выберите...</option>
            <option value="none">Без опыта работы</option>
            <option value="1-3">1–3 года</option>
            <option value="3+">3+ лет</option>
          </select>
          {errors.experience && <p className={styles.error}>{errors.experience}</p>}
        </div>

        <button type="submit" className={styles.submitBtn}>
          Отправить
        </button>
      </form>
      <Modal open={isModalOpen} onClose={closeModal} />

    </>
  );
}
