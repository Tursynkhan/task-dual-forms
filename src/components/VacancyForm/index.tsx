import { ChangeEvent, FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setDetails,
  updateVacancyAddress,
  removeVacancyAddress,
  addVacancyAddress,
  resetVacancyForm,
} from '../../store/vacancyFormSlice';
import { validateVacancy } from '../../utils/validateVacancy';
import { useModal } from '../../hooks/useModal';
import { FormField } from '../FormField';
import { AddressList } from '../AddressList';
import Modal from '../Modal/Modal';
import { VacancyErrors } from '../../types/Vacancy';
import { useCreateVacancyMutation } from '../../store/vacancyApi';
import styles from '../../assets/styles/FormCommon.module.scss';

export default function VacancyForm() {

  const dispatch = useAppDispatch();
  const form = useAppSelector(s => s.vacancyForm.details);
  const [createVacancy] = useCreateVacancyMutation();
  const [errors, setErrors] = useState<VacancyErrors>({ addresses: [] });
  const { isOpen, open, close } = useModal();

  const handleField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let payload: string | number = value;

    if (name === 'salaryFrom' || name === 'salaryTo') {
      payload = value === '' ? '' : Number(value);
    }

    dispatch(
      setDetails({
        ...form,
        [name]: payload,
      })
    );
  };

  const handleAddr = (i: number, field: keyof typeof form.addresses[0], value: string) =>
    dispatch(updateVacancyAddress({ id: i, data: { ...form.addresses[i], [field]: value } }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateVacancy(form);
    setErrors(errs);
    const hasError =
      Object.values(errs).some(v => v !== undefined) ||
      (errs.addresses?.some(a => a.city || a.street) ?? false);

    if (hasError) return;
    console.log('Отправка формы:', form);
    try {
      await createVacancy(form).unwrap();
      dispatch(resetVacancyForm());
      open();
    } catch (error) {
      console.error('Ошибка при отправке вакансии:', error);
    }

  };

  return (
    <>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2>О заявке</h2>
        <FormField label="Название вакансии" htmlFor="title" error={errors.title} required>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleField}
          />
        </FormField>

        <FormField label="Обязанности, требования, условия:" htmlFor="description" error={errors.description} required>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleField}
            style={{ maxWidth: "800px" }} />
        </FormField>

        <FormField label="Город проживания:" htmlFor="city" error={errors.city} required>
          <select id="city" name="city" value={form.city} onChange={handleField}>
            <option value="">Выберите...</option>
            <option value="Almaty">Алма-Ата</option>
            <option value="Astana">Астана</option>
          </select>
        </FormField>

        <FormField label="Адрес:"
          htmlFor="addresses"
          required
          error={errors.addresses?.some(a => a.city || a.street) ? "Укажите адрес" : undefined}>
          <AddressList
            addresses={form.addresses}
            cityOptions={[{ value: 'Almaty', label: 'Алма-Ата' }, { value: 'Astana', label: 'Астана' }]}
            onChange={handleAddr}
            onRemove={i => dispatch(removeVacancyAddress(i))}
            onAdd={() => dispatch(addVacancyAddress())}
            errors={errors.addresses}
          />
        </FormField>
        <FormField
          label="Зарплата:"
          htmlFor='salary'
          required
          error={errors.salaryFrom || errors.salaryTo ? "Укажите зарплату" : undefined}
        >

          <div className={styles.inputWrap}>
            <input
              name="salaryFrom"
              type="number"
              min={0}
              placeholder="От"
              onWheel={e => e.currentTarget.blur()}
              value={form.salaryFrom}
              onChange={handleField}

            />
            {errors.salaryFrom && <p className={styles.error}>{errors.salaryFrom}</p>}
            <input
              name="salaryTo"
              type="number"
              min={0}
              onWheel={e => e.currentTarget.blur()}
              placeholder="До"
              value={form.salaryTo}
              onChange={handleField}
            />
            {errors.salaryTo && <p className={styles.error}>{errors.salaryTo}</p>}
          </div>
        </FormField>
        <FormField label="Опыт работы:" htmlFor="experience" error={errors.experience}>
          <select id="experience" name="experience" value={form.experience} onChange={handleField}>
            <option value="">Выберите...</option>
            <option value="none">Без опыта работы</option>
            <option value="1-3">1–3 года</option>
            <option value="3+">3+ лет</option>
          </select>
        </FormField>

        <button type="submit" className={styles.submitBtn}>
          Отправить
        </button>
      </form>
      <Modal open={isOpen} onClose={close} />

    </>
  );
}
