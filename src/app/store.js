import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import listingReducer from '../features/listing/listingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listing: listingReducer,
  },
})
