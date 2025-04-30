import { Outlet } from 'react-router-dom';
import styles from './FormLayout.module.scss';

export default function FormLayout() {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
}