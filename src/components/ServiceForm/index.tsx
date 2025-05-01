import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateField as updateServiceField,
  addAddress as addServiceAddress,
  updateAddress as updateServiceAddress,
  removeAddress as removeServiceAddress,
  resetForm as resetServiceForm,
} from '../../store/serviceFormSlice';
import { Address } from '../../types/Service';
import { ServiceErrors } from '../../types/Service';
import Modal from '../Modal/Modal';
import styles from '../FormCommon.module.scss';


export default function ServiceForm() {
  const dispatch = useAppDispatch()
  const service = useAppSelector(s => s.serviceForm)
  const [isModalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState<ServiceErrors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' && (e.target as HTMLInputElement).checked;
    dispatch(
      updateServiceField({ [name]: type === 'checkbox' ? checked : value })
    );
  };

  const handleAddressChange = (
    id: number,
    field: keyof Address,
    value: string
  ) => {
    dispatch(updateServiceAddress({ id, data: { ...service.addresses[id], [field]: value } }));
  };

  const validate = (): boolean => {
    const errs: ServiceErrors = {};
    if (!service.description) errs.description = 'Обязательное поле';
    if (!service.city) errs.city = 'Обязательное поле';
    const addrErrs = service.addresses.map(() => ({} as { city?: string; detail?: string }));
    service.addresses.forEach((a, i) => {
      if (!a.city) addrErrs[i].city = 'Укажите город';
      if (!a.street) addrErrs[i].detail = 'Укажите адрес';
    });
    errs.addresses = addrErrs;
    if (!service.contactMethod) errs.contactMethod = 'Обязательное поле';
    if (!service.budget) errs.budget = 'Обязательное поле';
    if (!service.budgetType) errs.budgetType = 'Обязательное поле';
    setErrors(errs);
    return !(
      errs.description ||
      errs.city ||
      errs.addresses.some(e => e.city || e.street) ||
      errs.contactMethod ||
      errs.budget ||
      errs.budgetType
    );
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log(service);
    dispatch(resetServiceForm());
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2>О заявке</h2>

        <div className={styles.formRow}>
          <label>Описание:</label>
          <textarea
            name="description"
            value={service.description}
            onChange={handleChange}
          />
          {errors.description && <p className={styles.error}>{errors.description}</p>}

        </div>

        <div className={styles.formRow}>
          <label>Город заявки:</label>
          <select name="city" value={service.city} onChange={handleChange}>
            <option value="">Выберите...</option>
            <option value="Almaty">Алма-Ата</option>
            <option value="Astana">Астана</option>
          </select>
          {errors.city && <p className={styles.error}>{errors.city}</p>}

        </div>

        <div className={`${styles.formRow} ${styles.addresses}`}>
          <label>Адрес:</label>
          <div className={styles.addressList}>
            {service.addresses.map((addr, id) => (
              <div key={id} className={styles.addressRow}>
                <span>
                  <img src="../public/drag-handle.png" alt="drag-handle" width={16} height={16} />
                </span>
                <div className={styles.wrap}>
                  <select name='address' value={addr.city}
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
                    onChange={(e) => handleAddressChange(id, 'street', e.target.value)} />
                  {errors.addresses?.[id]?.street && (
                    <p className={styles.error}>
                      {errors.addresses[id]!.street}
                    </p>
                  )}

                </div>
                <button type="button" onClick={() => dispatch(removeServiceAddress(id))}>
                  <img src="../public/delete.svg" alt="delete" width={16} height={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addAddressBtn}
              onClick={() => dispatch(addServiceAddress())}
            >
              Добавить ещё адрес
            </button>
          </div>
        </div>

        <div className={styles.formRow}>
          <label>Способ связи:</label>
          <select name="contactMethod" value={service.contactMethod} onChange={handleChange}>
            <option value="">Выберите...</option>
            <option value="call">Позвонить</option>
            <option value="message">Написать</option>
          </select>
          {errors.contactMethod && (
            <p className={styles.error}>Обязательное поле</p>
          )}
        </div>

        <div className={styles.formRow} >
          <label>Сколько готовы заплатить:</label>
          <div className={styles.inputWrap}>
            <input
              name="budget"
              type="number"
              value={service.budget}
              onChange={handleChange}
            />
            {errors.budget && <p className={styles.error}>{errors.budget}</p>}

            <select name="budgetType" value={service.budgetType} onChange={handleChange}>
              <option value="">Выберите...</option>
              <option value="total">За всю работу</option>
              <option value="hour">За час</option>
            </select>
            {errors.budgetType && <p className={styles.error}>{errors.budgetType}</p>}

          </div>
        </div>
        <div className={`${styles.formRow} ${styles.requirements}`}>
          <label>Требования к специалистам:</label>
          <div className={styles.inputWrap}>
            <label className={styles.checkbox}>
              <input
                name="requirementsConfirmed"
                type="checkbox"
                checked={service.requirementsConfirmed}
                onChange={handleChange}

              />
              Личность подтверждена
            </label>
            <label className={styles.checkbox}>
              <input
                name="requirementsWithPhotos"
                type="checkbox"
                checked={service.requirementsWithPhotos}
                onChange={handleChange}

              />
              С фото работ в анкете
            </label>
            <label className={styles.checkbox}>
              <input
                name="requirementsWithReviews"
                type="checkbox"
                checked={service.requirementsWithReviews}
                onChange={handleChange}

              />
              С отзывами
            </label>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Отправить
        </button>
      </form>
      <Modal open={isModalOpen} onClose={closeModal} />
    </>

  );
}