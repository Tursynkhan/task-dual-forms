import styles from './Modal.module.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export default function Modal({ open, onClose }: ModalProps) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.content}>Вы успешно отправили форму</div>
        <img src="/task-dual-forms/success.png" alt="success" width={48} height={48} className={styles.image} />
      </div>
    </div>
  );
}