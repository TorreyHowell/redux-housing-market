import Center from '../tui/Center'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {
  getListingInRange,
  reset,
  setGeo,
} from '../features/listing/listingSlice'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import styles from '../styles/Home.module.css'
import Spinner from '../components/Spinner'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format'

function Home() {
  const [postal, setPostal] = useState('')

  const [geoLocation, setGeoLocation] = useState(null)

  const { height } = useWindowDimensions()

  const { geoCode, listings, isLoading, backGroundLoad } = useSelector(
    (state) => state.listing
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (geoLocation) {
      dispatch(setGeo(geoLocation))
    }
  }, [dispatch, geoLocation])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setGeoLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, [])

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(getListingInRange(postal))
  }

  if (isLoading) return <Spinner />

  return (
    <>
      <p className={`header ${styles.header}`}>Search Near You</p>
      <form onSubmit={onSubmit} className={styles.form}>
        <input
          className={styles.input}
          id="postal"
          type="number"
          value={postal}
          onChange={(e) => setPostal(e.target.value)}
          placeholder="Area Code"
        />
        <button className={styles.button} type="submit">
          Search
        </button>
      </form>
      {geoCode && !backGroundLoad ? (
        <Center>
          <div
            style={{
              height: `${height - 300}px`,
            }}
            className={styles.leafletContainer}
          >
            <MapContainer
              style={{ height: '100%', width: '100%' }}
              center={[geoCode?.lat, geoCode?.lng]}
              zoom={12}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
              />

              {listings.map((listing) => (
                <Marker
                  key={listing.id}
                  position={[listing.geolocation.lat, listing.geolocation.lng]}
                >
                  <Popup>
                    <div className={styles.popup}>
                      <p>
                        {listing.name}
                        <br />
                        {
                          <NumberFormat
                            value={
                              listing.offer
                                ? listing.discountedPrice
                                : listing.regularPrice
                            }
                            displayType="text"
                            thousandSeparator={true}
                            prefix={'$'}
                          />
                        }{' '}
                        {listing.type === 'rent' && '/Month'}
                        <br />
                        {`${listing.bedrooms} Bed | ${listing.bathrooms} Bath | ${listing.sqft} sqft`}
                      </p>

                      <Link to={`/category/${listing.type}/${listing.id}`}>
                        View Listing
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Center>
      ) : (
        <>
          <div
            style={{
              height: `${height - 300}px`,
            }}
            className={styles.loadingMap}
          ></div>
        </>
      )}
    </>
  )
}
export default Home
