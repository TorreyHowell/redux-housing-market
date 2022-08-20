import styles from '../styles/ListingItem.module.css'
import Center from '../tui/Center'
import NumberFormat from 'react-number-format'
import { Link } from 'react-router-dom'
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

function ListingItem({ listing, onDelete, onEdit }) {
  dayjs.extend(relativeTime)

  const timeFrom = dayjs(listing.timestamp * 1000).from(dayjs())
  return (
    <>
      <Center>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Link
              className={styles.cardHeaderText}
              to={`/category/${listing.type}/${listing.id}`}
            >
              <p className={styles.cardHeader}>{listing.name}</p>
              <p className={styles.cardDate}>{timeFrom}</p>
            </Link>

            <div className={styles.icons}>
              {onEdit && (
                <FaEdit color="rgb(104, 213, 247)" onClick={() => onEdit()} />
              )}

              {onDelete && (
                <FaTrashAlt color="red" onClick={() => onDelete()} />
              )}
            </div>
          </div>
          <Link to={`/category/${listing.type}/${listing.id}`}>
            <Center>
              <img
                className={styles.cardImage}
                src={listing.imgUrls[0]}
                alt=""
              />
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
            <p>{`${listing.bedrooms} Bed | ${listing.bathrooms} Bath | ${listing.sqft} sqft`}</p>
            <p
              style={{
                marginTop: '5px',
              }}
            >
              {listing?.address?.addressLine1}
            </p>
            <p>
              {listing?.address?.city}, {listing?.address?.state}
            </p>
          </Link>
        </div>
      </Center>
    </>
  )
}
export default ListingItem
