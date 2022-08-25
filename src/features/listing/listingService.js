import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDoc,
  doc,
  serverTimestamp,
  addDoc,
  deleteDoc,
  updateDoc,
  on,
} from 'firebase/firestore'

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { db } from '../../firebase.config'
import { getAuth } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid'
import { validateCreateForm } from './listingValidation'
import { isEmpty } from 'lodash'

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

const getRecentListings = async () => {
  const listingRef = collection(db, 'listings')

  const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5))

  const querySnap = await getDocs(q)

  const listings = []

  querySnap.forEach((doc) => {
    const data = doc.data()
    data.timestamp = data.timestamp.seconds

    return listings.push({
      id: doc.id,
      ...data,
    })
  })

  return listings
}

const getListingInRange = async (postal, geoCode) => {
  const listingRef = collection(db, 'listings')

  let geolocation = {}

  if (geoCode) {
    geolocation = geoCode
  } else {
    geolocation = await getGeolocationByPostal(postal)
  }

  const { lat, lng } = geolocation

  const northLimit = lat + 10 / 69
  const southLimit = lat - 10 / 69
  const eastLimit = lng + 10 / 55
  const westLimit = lng - 10 / 55

  const q = query(
    listingRef,
    where('geolocation.lat', '<=', northLimit),
    where('geolocation.lat', '>=', southLimit)
  )

  const querySnap = await getDocs(q)

  const listings = []

  querySnap.forEach((doc) => {
    const data = doc.data()
    data.timestamp = data.timestamp.seconds

    // Firebase won't allow multiple where queries on different fields
    // so i'm filtering lat on server and lng on client until i look into another way
    if (
      data.geolocation.lng <= eastLimit &&
      data.geolocation.lng >= westLimit
    ) {
      return listings.push({
        id: doc.id,
        ...data,
      })
    }
  })

  return {
    listings: listings,
    geocode: geolocation,
  }
}

const getListing = async (listingID) => {
  // get collection reference
  const docRef = doc(db, 'listings', listingID)

  const docSnap = await getDoc(docRef)

  if (docSnap.exists) {
    const data = docSnap.data()

    data.timestamp = data.timestamp.seconds

    return {
      ...data,
      id: docSnap.id,
    }
  }

  throw new Error('None found')
}

const getUserListings = async () => {
  const auth = getAuth()

  const listingRef = collection(db, 'listings')

  const q = query(
    listingRef,
    where('userRef', '==', auth.currentUser.uid),
    orderBy('timestamp', 'desc')
  )

  const querySnap = await getDocs(q)

  const listings = []

  querySnap.forEach((doc) => {
    const data = doc.data()

    data.timestamp = data.timestamp.seconds

    return listings.push({
      id: doc.id,
      ...data,
    })
  })

  return listings
}

const createListing = async (listingData) => {
  const formErrors = validateCreateForm(listingData)

  const auth = getAuth()

  if (!isEmpty(formErrors)) {
    return {
      error: true,
      errorMessages: formErrors,
      message: 'Invalid Input',
    }
  }

  if (listingData.regularPrice <= listingData.discountedPrice) {
    throw new Error('Discounted price must be lower than regular')
  }

  listingData.userRef = auth.currentUser.uid
  listingData.timestamp = serverTimestamp()
  listingData.geolocation = await getGeolocation(listingData.address)
  listingData.imgUrls = await Promise.all(
    [...listingData.images].map((image) => storeImage(image))
  ).catch(() => {
    throw new Error('Images not uploaded')
  })

  delete listingData.images

  !listingData.offer && delete listingData.discountedPrice
  listingData.acres < 1 && delete listingData.acres

  const docRef = await addDoc(collection(db, 'listings'), listingData)

  return {
    type: listingData.type,
    id: docRef.id,
  }
}

const getGeolocation = async ({ addressLine1, city, state }) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${
      addressLine1 + ', ' + city + ', ' + state
    }&key=${process.env.REACT_APP_GEOCODE}`
  )

  const data = await response.json()

  if (data.status === 'ZERO_RESULTS') {
    throw new Error('Invalid Address')
  }

  return data.results[0].geometry.location
}

const getGeolocationByPostal = async (postal) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${postal}&key=${process.env.REACT_APP_GEOCODE}`
  )

  const data = await response.json()

  if (data.status === 'ZERO_RESULTS') {
    throw new Error('Invalid Address')
  }

  return data.results[0].geometry.location
}

const storeImage = async (image) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth()
    const storage = getStorage()
    const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

    const storageRef = ref(storage, 'images/' + fileName)

    const uploadTask = uploadBytesResumable(storageRef, image)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused')
            break
          case 'running':
            console.log('Upload is running')
            break
          default:
            break
        }
      },
      (error) => {
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL)
        })
      }
    )
  })
}

const editListing = async (listingData) => {
  const formErrors = validateCreateForm(listingData)

  if (!isEmpty(formErrors)) {
    return {
      error: true,
      errorMessages: formErrors,
      message: 'Invalid Input',
    }
  }

  if (listingData.regularPrice <= listingData.discountedPrice) {
    throw new Error('Discounted price must be lower than regular')
  }

  listingData.geolocation = await getGeolocation(listingData.address)

  if (!isEmpty(listingData.images)) {
    listingData.imgUrls = await Promise.all(
      [...listingData.images].map((image) => storeImage(image))
    ).catch(() => {
      throw new Error('Images not uploaded')
    })
  }

  delete listingData.images
  delete listingData.timestamp

  !listingData.offer && delete listingData.discountedPrice
  listingData.acres < 1 && delete listingData.acres

  const docRef = doc(db, 'listings', listingData.id)
  await updateDoc(docRef, listingData)
}

const deleteListing = async (listingId) => {
  await deleteDoc(doc(db, 'listings', listingId))
  return listingId
}

const listingService = {
  getListings,
  getListing,
  createListing,
  getUserListings,
  deleteListing,
  editListing,
  getRecentListings,
  getListingInRange,
}

export default listingService
