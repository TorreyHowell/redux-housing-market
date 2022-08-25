import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRecentListings } from '../features/listing/listingSlice'
import Spinner from '../components/Spinner'
import styles from '../styles/RecentSlider.module.css'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { useNavigate } from 'react-router-dom'
import NumberFormat from 'react-number-format'

function RecentSlider() {
  const { listings, isLoading } = useSelector((state) => state.listing)

  const navigate = useNavigate()

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getRecentListings())
  }, [dispatch])

  if (isLoading) return <Spinner />
  return (
    <>
      <p className={styles.header}>Recent Listings</p>
      <Swiper
        className={styles.swiperContainer}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {listings.map((listing) => (
          <SwiperSlide
            key={listing.id}
            onClick={() => {
              navigate(`/category/${listing.type}/${listing.id}`)
            }}
          >
            <div
              style={{
                background: `url(${listing.imgUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
                cursor: 'pointer',
              }}
              className={styles.swiperSlideDiv}
            >
              <p className={styles.swiperSlideText}>{listing.name}</p>
              <p className={styles.swiperSlidePrice}>
                <NumberFormat
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                  value={listing.discountedPrice ?? listing.regularPrice}
                />{' '}
                {listing.type === 'rent' && '/Month'}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
export default RecentSlider
