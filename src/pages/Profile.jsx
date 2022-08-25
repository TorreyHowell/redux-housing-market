import styles from '../styles/Profile.module.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset, updateProfile } from '../features/auth/authSlice'
import { useState } from 'react'
import Center from '../tui/Center'
import { Link } from 'react-router-dom'
import { getUserListings, stageDelete } from '../features/listing/listingSlice'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'
import ConfirmModel from '../components/ConfirmModel'

function Profile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [inputActive, setInputActive] = useState(true)
  const [modalIsOpen, setModalOpen] = useState(false)

  const { user } = useSelector((state) => state.auth)
  const { listings, isLoading } = useSelector((state) => state.listing)

  const [newData, setNewData] = useState({
    name: user.displayName,
    email: user.email,
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    dispatch(getUserListings())

    return () => {
      dispatch(reset())
    }
  }, [dispatch, user, navigate])

  const onLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const onChange = (e) => {
    setNewData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = () => {
    if (user.displayName !== newData.name || user.email !== newData.email) {
      dispatch(
        updateProfile({
          name: newData.name,
          email: newData.email,
        })
      )
    }

    setInputActive(true)
  }

  const onDelete = (id) => {
    // if (window.confirm('Are you sure you want to delete this listing?')) {
    //   dispatch(deleteListing(id))
    // }
    dispatch(stageDelete(id))
    setModalOpen(true)
  }

  const onEdit = (id) => {
    navigate(`/edit-listing/${id}`)
  }

  if (isLoading) return <Spinner />

  return (
    <>
      <div className={styles.profileHeader}>
        <p>My Profile</p>
        <button className="hover" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className={styles.profileDetailsChange}>
        <p>Profile Details</p>
        <div className={styles.cancel}>
          {!inputActive && (
            <p
              onClick={() => {
                setInputActive(true)
              }}
              className={styles.changeButton}
            >
              Cancel
            </p>
          )}
          <p
            className={styles.changeButton}
            onClick={
              inputActive
                ? () => {
                    setInputActive(false)
                  }
                : onSubmit
            }
          >
            Change
          </p>
        </div>
      </div>

      <div className={styles.userDetails}>
        <input
          className={styles.input}
          name="name"
          id={!inputActive ? styles.active : ''}
          onChange={onChange}
          disabled={inputActive}
          value={newData.name}
        />
        <input
          className={styles.input}
          name="email"
          disabled
          value={newData.email}
        />
      </div>
      <Center>
        <Link to="/create-listing" className={`${styles.createButton} hover`}>
          Create Listing
        </Link>
      </Center>

      {!isLoading && listings?.length > 0 && (
        <>
          <h2
            style={{
              marginTop: '20px',
              color: '#f5f5f5',
            }}
          >
            My Listings
          </h2>
          <hr
            style={{
              marginBottom: '10px',
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }}
          />

          {listings.map((listing) => (
            <ListingItem
              onDelete={() => onDelete(listing.id)}
              onEdit={() => onEdit(listing.id)}
              listing={listing}
              id={listing.id}
              key={listing.id}
            />
          ))}
        </>
      )}

      <ConfirmModel
        closeModalState={() => {
          setModalOpen(false)
        }}
        modalOpen={modalIsOpen}
      />
    </>
  )
}
export default Profile
