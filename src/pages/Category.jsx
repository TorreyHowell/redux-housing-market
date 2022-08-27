import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getListings, reset, fetchMore } from '../features/listing/listingSlice'
import { useSelector } from 'react-redux'
import ListingItem from '../components/ListingItem'
import Center from '../tui/Center'
import Spinner from '../components/Spinner'

function Category() {
  const categoryName = useParams().categoryName
  const dispatch = useDispatch()

  const { listings, isLoading, lastFetched } = useSelector(
    (state) => state.listing
  )

  useEffect(() => {
    dispatch(getListings(categoryName))

    return () => {
      dispatch(reset())
    }
  }, [dispatch, categoryName])

  const onFetchMore = (e) => {
    e.preventDefault()
    dispatch(fetchMore(categoryName))
  }

  if (isLoading) return <Spinner />
  return (
    <>
      <header>
        <Center>
          <p className="header">
            Places For{' '}
            {categoryName.charAt(0).toLocaleUpperCase() + categoryName.slice(1)}
          </p>
        </Center>
      </header>

      <main>
        {listings.map((listing) => (
          <ListingItem listing={listing} id={listing.id} key={listing.id} />
        ))}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {lastFetched && (
            <button
              style={{
                marginTop: '10px',
                padding: '10px 50px',
                color: '#f4f4f4',
                backgroundColor: '#326270',
                border: 'none',
                borderRadius: '2rem',
                fontSize: '25px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              onClick={onFetchMore}
            >
              Load More
            </button>
          )}
        </div>
      </main>
    </>
  )
}
export default Category
