import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.scss';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/service"
        className={({ isActive }) =>
          isActive ? styles.linkActive : styles.link
        }
      >
        Услуги
      </NavLink>
      <NavLink
        to="/vacancy"
        className={({ isActive }) =>
          isActive ? styles.linkActive : styles.link
        }
      >
        Вакансии
      </NavLink>
    </nav>
  );
}
