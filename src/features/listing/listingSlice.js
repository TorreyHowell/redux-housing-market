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
}

export const getListings = createAsyncThunk(
  'listing/getListings',
  async (category, thunkAPI) => {
    const lastFetched = thunkAPI.getState().listing.lastFetched
    try {
      return listingService.getListings(category, lastFetched)
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
  },
})

export const { reset, resetMessage, clearStageDelete } = listingSlice.actions
export default listingSlice.reducer
