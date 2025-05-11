import { useState, ChangeEvent, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateAddress as updateServiceAddress,
  resetForm as resetServiceForm,
  removeAddress as removeServiceAddress,
  addAddress as addServiceAddress,
  setDetails
} from '../../store/serviceFormSlice'
import { useCreateServiceMutation } from '../../store/serviceApi';
import { ServiceErrors } from '../../types/Service';
import { validateService } from '../../utils/validateService';
import { useModal } from '../../hooks/useModal';
import { FormField } from '../FormField';
import { AddressList } from '../AddressList';
import checkboxOptions from '../../utils/service';
import Modal from '../Modal/Modal';
import styles from '../../assets/styles/FormCommon.module.scss';


export default function ServiceForm() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.serviceForm.details);

  const [createService] = useCreateServiceMutation();
  const { isOpen, open, close } = useModal();
  const [errors, setErrors] = useState<ServiceErrors>({});


  const handleField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value;
    dispatch(setDetails({ ...form, [name]: newValue }));
  };

  const handleAddr = (
    i: number,
    field: keyof typeof form.addresses[0],
    value: string
  ) =>
    dispatch(
      updateServiceAddress({ id: i, data: { ...form.addresses[i], [field]: value } })
    );



  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateService(form);
    setErrors(errs);
    const hasError = Object.values(errs).some(
      v => v !== undefined
    ) || (errs.addresses?.some(a => a.city || a.street) ?? false);
    if (hasError) return;
    try {
      await createService(form).unwrap();
      dispatch(resetServiceForm());
      open();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2>О заявке</h2>

        <FormField label="Описание" htmlFor="description" error={errors.description} required>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleField}
          />
        </FormField>

        <FormField label="Город заявки:" htmlFor="city" error={errors.city} required>
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
            onRemove={i => dispatch(removeServiceAddress(i))}
            onAdd={() => dispatch(addServiceAddress())}
            errors={errors.addresses}
          />
        </FormField>
        <FormField label="Способ связи" htmlFor="contactMethod" error={errors.contactMethod} required>
          <select id="contactMethod" name="contactMethod" value={form.contactMethod} onChange={handleField}>
            <option value="">Выберите...</option>
            <option value="call">Позвонить</option>
            <option value="message">Написать</option>
          </select>
        </FormField>

        <FormField label="Сколько готовы заплатить:" htmlFor="budget" error={errors.budget} required>
          <div className={styles.inputWrap}>
            <input
              id="budget"
              name="budget"
              type="number"
              min={0}
              onWheel={(e) => e.currentTarget.blur()}
              value={form.budget}
              onChange={handleField}
            />
            <select id="budgetType" name="budgetType" value={form.budgetType} onChange={handleField}>
              <option value="">Выберите...</option>
              <option value="total">За всю работу</option>
              <option value="hour">За час</option>
            </select>
            {errors.budgetType && (
              <p className={styles.error}>{errors.budgetType}</p>
            )}
          </div>
        </FormField>

        <FormField
          label="Требования к специалистам:"
          htmlFor=""
          className={styles.requirements}
        >
          <div className={styles.inputWrap}>
            {checkboxOptions.map(({ name, label }) => (
              <label key={name} className={styles.checkbox}>
                <input
                  type="checkbox"
                  name={name}
                  checked={form[name]}
                  onChange={handleField}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </FormField>

        <button type="submit" className={styles.submitBtn}>
          Отправить
        </button>
      </form >
      <Modal open={isOpen} onClose={close} />
    </>

  );
}