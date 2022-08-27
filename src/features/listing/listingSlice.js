import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import listingService from './listingService'

const initialState = {
  listings: [],
  listing: null,
  lastFetched: null,
  isSuccess: false,
  isLoading: false,
  isError: false,
  navigateTo: '',
  message: '',
  formErrors: null,
  editSuccess: false,
  toDeleteID: '',
  geoCode: null,
  backGroundLoad: false,
}

export const getListings = createAsyncThunk(
  'listing/getListings',
  async (category, thunkAPI) => {
    try {
      return listingService.getListings(category)
    } catch (error) {
      return thunkAPI.rejectWithValue('Could not fetch listings')
    }
  }
)

export const getUserListings = createAsyncThunk(
  'listing/getUserListings',
  async (category, thunkAPI) => {
    try {
      return listingService.getUserListings()
    } catch (error) {
      return thunkAPI.rejectWithValue('Could not fetch listings')
    }
  }
)

export const fetchMore = createAsyncThunk(
  'listing/fetchMore',
  async (category, thunkAPI) => {
    try {
      const lastFetched = thunkAPI.getState().listing.lastFetched
      return listingService.fetchMore(category, lastFetched)
    } catch (error) {
      return thunkAPI.rejectWithValue('Could not fetch listings')
    }
  }
)

export const getListing = createAsyncThunk(
  'listing/getListing',
  async (listingID, thunkAPI) => {
    try {
      return listingService.getListing(listingID)
    } catch (error) {
      return thunkAPI.rejectWithValue('Could not fetch listing')
    }
  }
)

export const getRecentListings = createAsyncThunk(
  'listing/getRecentListings',
  async (_, thunkAPI) => {
    try {
      return listingService.getRecentListings()
    } catch (error) {
      return thunkAPI.rejectWithValue('Could not fetch listing')
    }
  }
)

export const createListing = createAsyncThunk(
  'listing/createListing',
  async (listingData, thunkAPI) => {
    try {
      const response = await listingService.createListing(listingData)

      if (response?.error === true) {
        return thunkAPI.rejectWithValue(response)
      }

      return response
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue({ message })
    }
  }
)

export const editListing = createAsyncThunk(
  'listing/editListing',
  async (listingData, thunkAPI) => {
    try {
      const response = await listingService.editListing(listingData)

      if (response?.error === true) {
        return thunkAPI.rejectWithValue(response)
      }

      return response
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue({ message })
    }
  }
)

export const deleteListing = createAsyncThunk(
  'listing/deleteListing',
  async (listingId, thunkAPI) => {
    try {
      return await listingService.deleteListing(listingId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue({ message })
    }
  }
)

export const stageDelete = createAsyncThunk(
  'listing/stageDelete',
  async (listingID, thunkAPI) => {
    return listingID
  }
)

export const getListingInRange = createAsyncThunk(
  'listing/getListingInRange',
  async (postal, thunkAPI) => {
    try {
      return listingService.getListingInRange(postal)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const setGeo = createAsyncThunk(
  'listing/setGeo',
  async (geoCode, thunkAPI) => {
    try {
      return listingService.getListingInRange(null, geoCode)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const listingSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetMessage: (state) => {
      state.message = ''
    },
    clearStageDelete: (state) => {
      state.toDeleteID = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListings.fulfilled, (state, action) => {
        state.isSuccess = true
        state.isLoading = false
        state.listings = action.payload.listings
        state.lastFetched = action.payload.lastFetched
      })
      .addCase(getListings.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getListings.rejected, (state, action) => {
        state.isLoading = false
      })
      .addCase(getListing.fulfilled, (state, action) => {
        state.listing = action.payload
        state.isLoading = false
      })
      .addCase(getListing.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getListing.rejected, (state, action) => {
        state.isLoading = false
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.isSuccess = true
        state.isLoading = false
        state.navigateTo = `/category/${action.payload.type}/${action.payload.id}`
      })
      .addCase(createListing.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(createListing.rejected, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.isError = true
        state.message = action.payload.message || ''
        state.formErrors = action.payload.errorMessages
      })
      .addCase(getUserListings.fulfilled, (state, action) => {
        state.isSuccess = true
        state.isLoading = false
        state.listings = action.payload
      })
      .addCase(getUserListings.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getUserListings.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.isSuccess = true
        state.isLoading = false
        state.listings = state.listings.filter(
          (listing) => listing.id !== action.payload
        )
      })
      .addCase(deleteListing.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
      })
      .addCase(editListing.fulfilled, (state, action) => {
        state.editSuccess = true
        state.isLoading = false
      })
      .addCase(editListing.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(editListing.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload.message || ''
        state.formErrors = action.payload.errorMessages
      })
      .addCase(stageDelete.fulfilled, (state, action) => {
        state.toDeleteID = action.payload
      })
      .addCase(getRecentListings.fulfilled, (state, action) => {
        state.listings = action.payload
        state.isLoading = false
      })
      .addCase(getRecentListings.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getRecentListings.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getListingInRange.fulfilled, (state, action) => {
        state.listings = action.payload.listings
        state.geoCode = action.payload.geocode
        state.isLoading = false
        state.backGroundLoad = false
      })
      .addCase(getListingInRange.pending, (state, action) => {
        if (state.geoCode) {
          state.isLoading = false
          state.backGroundLoad = true
        } else {
          state.isLoading = true
        }
      })
      .addCase(getListingInRange.rejected, (state, action) => {
        state.isLoading = false
        state.backGroundLoad = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(setGeo.fulfilled, (state, action) => {
        state.geoCode = action.payload.geocode
        state.listings = action.payload.listings
        state.isLoading = false
        state.backGroundLoad = false
      })
      .addCase(setGeo.pending, (state, action) => {
        if (state.geoCode) {
          state.isLoading = false
          state.backGroundLoad = true
        } else {
          state.isLoading = true
        }
      })
      .addCase(setGeo.rejected, (state, action) => {
        state.isLoading = false
        state.backGroundLoad = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(fetchMore.fulfilled, (state, action) => {
        state.isSuccess = true
        state.isLoading = false
        action.payload.listings.forEach((listing) => {
          return state.listings.push(listing)
        })

        state.lastFetched = action.payload.lastFetched
      })
      .addCase(fetchMore.pending, (state, action) => {})
      .addCase(fetchMore.rejected, (state, action) => {
        state.isLoading = false
      })
  },
})

export const { reset, resetMessage, clearStageDelete } = listingSlice.actions
export default listingSlice.reducer
