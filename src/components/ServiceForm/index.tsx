import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import styles from './ServiceForm.module.scss';

interface Address { city: string; street: string };
interface FormValues {
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

export default function ServiceForm() {

  const { register, control, handleSubmit, formState: { errors } } =
    useForm<FormValues>({ defaultValues: { addresses: [{ city: '', street: '' }] } });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses'
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2>О заявке</h2>

      <div className={styles.formRow}>
        <label>Описание:</label>
        <textarea
          {...register('description', { required: 'Обязательное поле' })}
        />
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}
      </div>

      <div className={styles.formRow}>
        <label>Город заявки:</label>
        <select {...register('city', { required: true })}>
          <option value="Almaty">Алма-Ата</option>
          <option value="Astana">Астана</option>
        </select>
        {errors.city && (
          <p className={styles.error}>Обязательное поле</p>
        )}
      </div>

      <div className={`${styles.formRow} ${styles.addresses}`}>
        <label>Адрес:</label>
        <div className={styles.addressList}>
          {fields.map((f, i) => (
            <div key={f.id} className={styles.addressRow}>
              <span>
                <img src="../public/drag-handle.png" alt="drag-handle" width={16} height={16} />
              </span>
              <div className={styles.wrap}>
                <select {...register(`addresses.${i}.city` as const, { required: true })}>
                  <option value="">Город</option>
                  <option value="Almaty">Алма-Ата</option>
                  <option value="Astana">Астана</option>
                </select>
                <input
                  placeholder="Улица"
                  {...register(`addresses.${i}.street` as const, { required: 'Укажите улицу' })}
                />
              </div>
              <button type="button" onClick={() => remove(i)}>
                <img src="../public/delete.svg" alt="delete" width={16} height={16} />
              </button>
              {errors.addresses?.[i]?.street && (
                <p className={styles.error}>
                  {errors.addresses[i]?.street?.message}
                </p>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.addAddressBtn}
            onClick={() => append({ city: '', street: '' })}
          >
            Добавить ещё адрес
          </button>
        </div>
      </div>

      <div className={styles.formRow}>
        <label>Способ связи:</label>
        <select {...register('contactMethod', { required: true })}>
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
            type="number"
            {...register('budget', {
              required: 'Обязательное поле',
              min: { value: 0, message: 'Нельзя меньше 0' }
            })}
          />
          {errors.budget && (
            <p className={styles.error}>{errors.budget.message}</p>
          )}
          <select {...register('budgetType', { required: true })}>
            <option value="total">За всю работу</option>
            <option value="hour">За час</option>
          </select>
          {errors.budgetType && (
            <p className={styles.error}>Обязательное поле</p>
          )}
        </div>
      </div>
      <div className={`${styles.formRow} ${styles.requirements}`}>
        <label>Требования к специалистам:</label>
        <div className={styles.inputWrap}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              {...register('requirementsConfirmed')}
            />
            Личность подтверждена
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              {...register('requirementsWithPhotos')}
            />
            С фото работ в анкете
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              {...register('requirementsWithReviews')}
            />
            С отзывами
          </label>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        Отправить
      </button>
    </form>
  );
}