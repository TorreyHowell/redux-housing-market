import styles from '../styles/Nav.module.css'
import { FaCompass, FaUserAlt, FaMapMarkedAlt } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

function Nav() {
  const location = useLocation()

  const pathMatch = (path) => {
    if (path === location.pathname) {
      return true
    }
  }

  return (
    <footer>
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <ul className={styles.navbarItems}>
            <li
              className={
                pathMatch('/explore')
                  ? styles.navbarItemActive
                  : styles.navbarItem
              }
            >
              <Link to={'/explore'}>
                <FaCompass />
              </Link>
            </li>
            <li
              className={
                pathMatch('/') ? styles.navbarItemActive : styles.navbarItem
              }
            >
              <Link to={'/'}>
                <FaMapMarkedAlt />
              </Link>
            </li>
            <li
              className={
                pathMatch('/profile')
                  ? styles.navbarItemActive
                  : styles.navbarItem
              }
            >
              <Link to={'/profile'}>
                <FaUserAlt />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </footer>
  )
}
export default Nav
