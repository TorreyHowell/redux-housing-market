import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import listingService from './listingService'

const initialState = {
  listings: [],
  lastFetched: null,
  isSuccess: false,
  isLoading: false,
  isError: false,
  message: '',
}

export const getListings = createAsyncThunk(
  'auth/getListings',
  async (category, thunkAPI) => {
    const lastFetched = thunkAPI.getState().listing.lastFetched
    try {
      return listingService.getListings(category, lastFetched)
    } catch (error) {
      return thunkAPI.rejectWithValue('Could not fetch listings')
    }
  }
)

export const listingSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getListings.fulfilled, (state, action) => {
      state.isSuccess = true
      state.isLoading = false
      state.listings = action.payload.listings
      state.lastFetched = action.payload.lastFetched
    })
  },
})

export const { reset } = listingSlice.actions
export default listingSlice.reducer
