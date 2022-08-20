import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getListings, reset } from '../features/listing/listingSlice'
import { useSelector } from 'react-redux'
import ListingItem from '../components/ListingItem'
import Center from '../tui/Center'
import Spinner from '../components/Spinner'

function Category() {
  const categoryName = useParams().categoryName
  const dispatch = useDispatch()

  const { listings, isLoading } = useSelector((state) => state.listing)

  useEffect(() => {
    dispatch(getListings(categoryName))

    return () => {
      dispatch(reset())
    }
  }, [dispatch, categoryName])

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
      </main>
    </>
  )
}
export default Category
