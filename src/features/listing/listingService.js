import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../../firebase.config'

const getListings = async (category) => {
  // get collection reference
  const listingRef = collection(db, 'listings')

  // create a query
  const q = query(
    listingRef,
    where('type', '==', category),
    orderBy('timestamp', 'desc'),
    limit(10)
  )

  // Execute query
  const querySnap = await getDocs(q)

  const lastVisible = querySnap.docs[querySnap.docs.length - 1]

  const listings = []

  querySnap.forEach((docs) => {
    const data = docs.data()

    data.timestamp = data.timestamp.seconds

    return listings.push({
      id: docs.id,
      ...data,
    })
  })

  return {
    lastFetched: JSON.stringify(lastVisible),
    listings: listings,
  }
}

const listingService = {
  getListings,
}

export default listingService
