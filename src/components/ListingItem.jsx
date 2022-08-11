import styles from '../styles/ListingItem.module.css'
import Center from '../tui/Center'
import NumberFormat from 'react-number-format'

function ListingItem({ listing }) {
  const date = new Date(listing.timestamp * 1000)
  return (
    <>
      <Center>
        <div className={styles.card}>
          <p className={styles.cardHeader}>{listing.name}</p>
          <p>{date.toDateString()}</p>
          <Center>
            <img className={styles.cardImage} src={listing.imgUrls[0]} alt="" />
          </Center>

          <p className={styles.price}>
            <NumberFormat
              value={
                listing.offer ? listing.discountedPrice : listing.regularPrice
              }
              displayType="text"
              thousandSeparator={true}
              prefix={'$'}
            />{' '}
            {listing.type === 'rent' && '/Month'}
          </p>
        </div>
      </Center>
    </>
  )
}
export default ListingItem
