import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getListings, reset } from '../features/listing/listingSlice'
import { useSelector } from 'react-redux'
import ListingItem from '../components/ListingItem'
import Center from '../tui/Center'

function Category() {
  const categoryName = useParams().categoryName
  const dispatch = useDispatch()

  const { listings } = useSelector((state) => state.listing)

  useEffect(() => {
    dispatch(getListings(categoryName))

    return () => {
      dispatch(reset())
    }
  }, [dispatch, categoryName])
  return (
    <>
      <header>
        <Center>
          <p className="header">Places for {categoryName}</p>
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
