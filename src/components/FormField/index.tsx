import styles from './FormField.module.scss';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string; 
}

export function FormField({ label, required = false, htmlFor, error, children ,  className = '', }: FormFieldProps) {
  return (
    <div className={`${styles.formRow} ${className}`}>
      <label htmlFor={htmlFor}>{label}
        {required && <span className={styles.asterisk}>*</span>}
      </label>
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}