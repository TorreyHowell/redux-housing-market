import styles from '../styles/Explore.module.css'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import { Link } from 'react-router-dom'
import RecentSlider from '../components/RecentSlider'

function Explore() {
  return (
    <>
      <header>
        <p className={styles.header}>Explore</p>
      </header>

      <RecentSlider />

      <p className={styles.categoriesLabel}>Categories</p>

      <div className={styles.categories}>
        <Link to="/category/rent">
          <img
            className={styles.categoryImages}
            src={rentCategoryImage}
            alt="rent"
          />
          <p className={styles.categoryName}>Places for rent</p>
        </Link>
        <Link to="/category/sale">
          <img
            className={styles.categoryImages}
            src={sellCategoryImage}
            alt="rent"
          />
          <p className={styles.categoryName}>Places for Sale</p>
        </Link>
      </div>
    </>
  )
}
export default Explore
