import styles from './AddressList.module.scss';

export interface Address {
  city: string;
  street: string;
}

export interface AddressListProps {
  addresses: Address[];
  cityOptions: { value: string; label: string }[];
  onChange: (idx: number, field: keyof Address, value: string) => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
  errors?: { city?: string; street?: string }[];
}

export function AddressList({
  addresses,
  onChange,
  onRemove,
  onAdd,
  cityOptions,
  errors
}: AddressListProps) {
  return (
    <div className={styles.addressList}>
      {addresses.map((addr, id) => (
        <div key={id} className={styles.addressRow}>
          <span>
            <img src="/task-dual-forms/drag-handle.png" alt="drag-handle" width={16} height={16} />
          </span>
          <div className={styles.wrap}>
            <select name='city' value={addr.city}
              onChange={(e) => onChange(id, 'city', e.target.value)}
            >
              <option value="">Город</option>
              {cityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors?.[id]?.city && (
              <p className={styles.error}>
                {errors[id]!.city}
              </p>
            )}
            <input
              name="street"
              placeholder="Улица"
              value={addr.street}
              onChange={(e) => onChange(id, 'street', e.target.value)} />
          </div>
          <button type="button" onClick={() => onRemove(id)}>
            <img src="/task-dual-forms/delete.svg" alt="delete" width={16} height={16} />
          </button>
        </div>
      ))}
      <button type="button" className={styles.addAddressBtn} onClick={onAdd}>
        Добавить ещё адрес
      </button>
    </div>
  );
}
