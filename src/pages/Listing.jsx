import styles from '../styles/Listing.module.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getListing, reset } from '../features/listing/listingSlice'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import Center from '../tui/Center'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import NumberFormat from 'react-number-format'
import { FaCouch, FaCar } from 'react-icons/fa'

function Listing() {
  const params = useParams()
  const dispatch = useDispatch()

  const { isLoading, listing } = useSelector((state) => state.listing)

  useEffect(() => {
    dispatch(getListing(params.listingID))

    return () => {
      dispatch(reset())
    }
  }, [dispatch, params.listingID])

  if (isLoading) return <></>
  if (!listing) return <></>
  return (
    <>
      <main>
        <Swiper
          className={styles.swiperContainer}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          {listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className={styles.swiperSlideDiv}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>

        <p className={styles.info} style={{ marginTop: '10px' }}>
          {listing.name}
          {' - '}
          <NumberFormat
            value={
              listing.offer ? listing.discountedPrice : listing.regularPrice
            }
            displayType="text"
            thousandSeparator={true}
            prefix={'$'}
          />
          {listing.type === 'rent' && ' /Month'}
        </p>
        <p className={styles.info}>
          {`${listing.bedrooms} Bed | ${listing.bathrooms} Bath | ${listing.sqft} Sqft`}{' '}
          {listing.acres && `| ${listing.acres} Acres`}
        </p>

        <p className={styles.address1}>{listing?.address?.addressLine1}</p>
        <p className={styles.address2}>
          {listing?.address?.city}, {listing?.address?.state}
        </p>

        <p className={styles.description}>{listing.description}</p>

        <div className={styles.features}>
          {listing.parking && (
            <div className={styles.featuresItem}>
              <FaCar />
              <p>Parking</p>
            </div>
          )}

          {listing.furnished && (
            <div className={styles.featuresItem}>
              <FaCouch />
              <p>Furnished</p>
            </div>
          )}
        </div>

        <Center>
          <div className={styles.leafletContainer}>
            <MapContainer
              style={{ height: '100%', width: '100%' }}
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={15}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
              />
              <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
              >
                <Popup>{listing.location}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </Center>
      </main>
    </>
  )
}
export default Listing
