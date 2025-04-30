import { useForm, useFieldArray } from 'react-hook-form';
import styles from '../FormCommon.module.scss';

interface Address { city: string; street: string };

interface FormValues {
  title: string;
  description: string;
  city: string;
  addresses: Address[];
  salaryFrom: number;
  salaryTo: number;
  experience: string;
};

export default function VacancyForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { addresses: [] } });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });

  const onSubmit = (data: FormValues) => {
    console.log('VacancyForm data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2>О заявке (Вакансия)</h2>

      <div className={styles.formRow}>
        <label>Название вакансии:</label>
        <input
          {...register('title', { required: 'Обязательное поле' })}
        />
        {errors.title && (
          <p className={styles.error}>{errors.title.message}</p>
        )}
      </div>

      <div className={styles.formRow}>
        <label>Обязанности, требования, условия:</label>
        <textarea
          {...register('description', { required: 'Обязательное поле' })}
        />
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}
      </div>

      <div className={styles.formRow}>
        <label>Город проживания:</label>
        <select {...register('city', { required: 'Обязательное поле' })}>
          <option value="Almaty">Алма-Ата</option>
          <option value="Astana">Астана</option>
        </select>
        {errors.city && (
          <p className={styles.error}>{errors.city.message}</p>
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
                  <option value="" disabled hidden>Город</option>
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
            type="number"
            placeholder="От"
            {...register('salaryFrom', {
              required: 'Обязательное поле',
              min: { value: 0, message: '>= 0' },
            })}
          />
          <input
            type="number"
            placeholder="До"
            {...register('salaryTo', {
              required: 'Обязательное поле',
              min: { value: 0, message: '>= 0' },
            })}
          />
        </div>
        {(errors.salaryFrom || errors.salaryTo) && (
          <p className={styles.error}>
            {errors.salaryFrom?.message || errors.salaryTo?.message}
          </p>
        )}
      </div>

      <div className={styles.formRow}>
        <label>Опыт работы:</label>
        <select {...register('experience', { required: 'Обязательное поле' })}>
          <option value="none">Без опыта работы</option>
          <option value="1-3">1–3 года</option>
          <option value="3+">3+ лет</option>
        </select>
        {errors.experience && (
          <p className={styles.error}>{errors.experience.message}</p>
        )}
      </div>

      <button type="submit" className={styles.submitBtn}>
        Отправить
      </button>
    </form>
  );
}
