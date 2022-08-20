import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import {
  editListing,
  getListing,
  reset,
} from '../features/listing/listingSlice'
import styles from '../styles/EditListing.module.css'
import Center from '../tui/Center'
import { AddressAutofill } from '@mapbox/search-js-react'
import { v4 as uuidv4 } from 'uuid'

function EditListing() {
  const { user } = useSelector((state) => state.auth)
  const { listing, isLoading, formErrors, editSuccess } = useSelector(
    (state) => state.listing
  )

  const [formData, setFormData] = useState({
    name: '',
    type: 'sale',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    acres: 0,
    parking: false,
    furnished: false,
    description: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
  })
  const [address, setAddress] = useState({
    addressLine1: '',
    state: '',
    city: '',
  })

  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (editSuccess) {
      navigate('/profile')
    }

    if (!listing) {
      dispatch(getListing(params.id))
    }

    if (!isLoading && listing) {
      if (listing?.userRef !== user?.id) {
        navigate('/profile')
      }
    }
  }, [dispatch, params.id, isLoading, listing, navigate, user, editSuccess])

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  useEffect(() => {
    if (listing) {
      setFormData((prevState) => ({
        ...prevState,
        ...listing,
      }))
      setAddress((prevState) => ({
        ...prevState,
        ...listing?.address,
      }))
    }
  }, [listing])

  const onChange = (e) => {
    e.preventDefault()

    let boolean = null

    if (e.target.name === 'boolean') {
      if (e.target.value === 'true') {
        boolean = true
      }
      if (e.target.value === 'false') {
        boolean = false
      }
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
      return
    }

    if (e.target.type === 'number') {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value ? parseInt(e.target.value) : 0,
      }))
      return
    }

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: boolean ?? e.target.value,
    }))
  }

  const onAddressChange = (e) => {
    setAddress((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const fullData = {
      ...formData,
      address: address,
    }

    dispatch(editListing(fullData))
  }

  if (isLoading) return <Spinner />
  return (
    <>
      <p className={styles.header}>Edit Listing</p>

      <Center>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.formLabel}>Title</label>
          <input
            name="///"
            id="name"
            className={styles.input}
            onChange={onChange}
            value={formData?.name}
          />
          {formErrors?.title && (
            <p className={styles.errorText}>*{formErrors.title}</p>
          )}

          <label className={styles.formLabel}>Sell / Rent</label>
          <div className={styles.formButtons}>
            <button
              onClick={onChange}
              value={'sale'}
              id="type"
              className={
                formData?.type === 'sale' ? styles.buttonActive : styles.button
              }
            >
              Sell
            </button>
            <button
              onClick={onChange}
              id="type"
              value="rent"
              className={
                formData?.type === 'rent' ? styles.buttonActive : styles.button
              }
            >
              Rent
            </button>
          </div>

          <div className={styles.labelRow}>
            <label className={styles.formLabel}>Bedrooms</label>
            <label className={styles.formLabel}>Bathrooms</label>
          </div>

          <div className={styles.inputRow}>
            <div
              style={{
                marginRight: '10px',
              }}
            >
              <input
                name="bedrooms"
                id="bedrooms"
                type="number"
                className={styles.smallInput}
                onChange={onChange}
                value={formData?.bedrooms || ''}
                autoComplete="off"
                style={{
                  width: '100%',
                }}
              />
              {formErrors?.bedrooms && (
                <p className={styles.errorText}>*{formErrors.bedrooms}</p>
              )}
            </div>

            <div
              style={{
                marginLeft: '10px',
              }}
            >
              <input
                name="bathrooms"
                id="bathrooms"
                type="number"
                className={styles.smallInput}
                onChange={onChange}
                value={formData?.bathrooms || ''}
                autoComplete="off"
                style={{
                  width: '100%',
                }}
              />
              {formErrors?.bathrooms && (
                <p id={styles.errorEnd} className={styles.errorText}>
                  *{formErrors.bathrooms}
                </p>
              )}
            </div>
          </div>

          <div className={styles.labelRow}>
            <label className={styles.formLabel}>Sqft</label>
            <label className={styles.formLabel}>Acres</label>
          </div>

          <div className={styles.inputRow}>
            <input
              name="sqft"
              id="sqft"
              type="number"
              className={styles.smallInput}
              onChange={onChange}
              value={formData?.sqft || ''}
              autoComplete="off"
            />

            <input
              name="acres"
              id="acres"
              type="number"
              className={styles.smallInput}
              onChange={onChange}
              value={formData?.acres || ''}
              autoComplete="off"
            />
          </div>

          <label className={styles.formLabel}>Parking</label>
          <div className={styles.formButtons}>
            <button
              onClick={onChange}
              value={true}
              name="boolean"
              id="parking"
              className={
                formData?.parking ? styles.buttonActive : styles.button
              }
            >
              Yes
            </button>
            <button
              onClick={onChange}
              id="parking"
              name="boolean"
              value={false}
              className={
                !formData?.parking ? styles.buttonActive : styles.button
              }
            >
              No
            </button>
          </div>

          <label className={styles.formLabel}>Furnished</label>
          <div className={styles.formButtons}>
            <button
              onClick={onChange}
              value={true}
              name="boolean"
              id="furnished"
              className={
                formData?.furnished ? styles.buttonActive : styles.button
              }
            >
              Yes
            </button>
            <button
              onClick={onChange}
              id="furnished"
              name="boolean"
              value={false}
              className={
                !formData?.furnished ? styles.buttonActive : styles.button
              }
            >
              No
            </button>
          </div>

          <label className={styles.formLabel}>Description</label>
          <textarea
            className={styles.textArea}
            id="description"
            value={formData?.description}
            onChange={onChange}
            maxLength={500}
          ></textarea>
          {formErrors?.description && (
            <p className={styles.errorText}>*{formErrors.description}</p>
          )}

          <label className={styles.formLabel}>Street Address</label>
          <AddressAutofill
            accessToken={process.env.REACT_APP_MAPBOX}
            theme={{
              variables: {
                colorBackground: '#1d1d1d',
                colorText: '#f4f4f4',
                colorBackgroundHover: '#3d3d3d',
              },
            }}
          >
            <input
              name={uuidv4()}
              id="addressLine1"
              className={styles.input}
              onChange={onAddressChange}
              value={address?.addressLine1}
              autoComplete="address-line1"
            />
          </AddressAutofill>

          <div className={styles.labelRow}>
            <label className={styles.formLabel}>State</label>
            <label className={styles.formLabel}>City</label>
          </div>

          <div className={styles.inputRow}>
            <input
              name="city"
              id="city"
              type="text"
              className={styles.smallInput}
              onChange={onAddressChange}
              value={address?.city}
              autoComplete="address-level2"
            />
            <input
              name="bedrooms"
              id="state"
              type="text"
              className={styles.smallInput}
              onChange={onAddressChange}
              value={address?.state}
              autoComplete="address-level1"
            />
          </div>

          <label className={styles.formLabel}>Discount</label>
          <div className={styles.formButtons}>
            <button
              type="button"
              onClick={onChange}
              className={formData?.offer ? styles.buttonActive : styles.button}
              id="offer"
              name="boolean"
              value={true}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onChange}
              className={!formData?.offer ? styles.buttonActive : styles.button}
              id="offer"
              name="boolean"
              value={false}
            >
              No
            </button>
          </div>

          <div className={styles.labelRow}>
            <label className={styles.formLabel}>Price</label>
            {formData?.offer && (
              <label className={styles.formLabel}>Discount Price</label>
            )}
          </div>

          <div className={styles.inputRow}>
            <input
              name="regularPrice"
              id="regularPrice"
              type="number"
              className={styles.smallInput}
              onChange={onChange}
              value={formData?.regularPrice || ''}
            />

            {formData?.offer && (
              <input
                name="discountedPrice"
                id="discountedPrice"
                type="number"
                className={styles.smallInput}
                onChange={onChange}
                value={formData.discountedPrice || ''}
              />
            )}
          </div>
          {formErrors?.regularPrice && (
            <p className={styles.errorText}>*{formErrors.regularPrice}</p>
          )}

          <label className={styles.formLabel}>Images</label>
          <input
            className={styles.images}
            type="file"
            id="images"
            onChange={onChange}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
          />
          {formErrors?.images && (
            <p className={styles.errorText}>*{formErrors.images}</p>
          )}

          <button className={styles.submit} type="submit">
            Submit Edit
          </button>
        </form>
      </Center>
    </>
  )
}
export default EditListing
