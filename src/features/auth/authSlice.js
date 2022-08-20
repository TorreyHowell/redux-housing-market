import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

const initialState = {
  user: null,
  isSuccess: false,
  isLoading: false,
  isError: false,
  errors: {
    passwordError: false,
    nameError: false,
    passwordMessage: '',
    nameMessage: '',
  },

  message: '',
}

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    const { errors, messages } = authService.registerValidation(userData)

    if (errors) {
      return thunkAPI.rejectWithValue(messages)
    }

    try {
      return authService.register(userData)
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

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (user, thunkAPI) => {
    return {
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return authService.login(userData)
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

export const oauth = createAsyncThunk('auth/oauth', async (_, thunkAPI) => {
  try {
    return await authService.oauth()
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateProfile = createAsyncThunk(
  'auth/update',
  async (userData, thunkAPI) => {
    try {
      return authService.update(userData)
    } catch (error) {
      return thunkAPI.rejectWithValue('Could not update profile')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (userData, thunkAPI) => {
    try {
      return authService.logout()
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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.errors = {
        passwordError: false,
        nameError: false,
        passwordMessage: '',
        nameMessage: '',
      }
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isSuccess = true
        state.isLoading = false
        console.log(action.payload)
        state.user = action.payload
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.rejected, (state, action) => {
        state.errors = action.payload
        state.isLoading = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isSuccess = true
      })
      .addCase(login.rejected, (state) => {
        state.isError = true
        state.message = 'Invalid Login'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isSuccess = true
        state.user.name = action.payload.name
        state.user.email = action.payload.email
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.message = action.payload
      })
      .addCase(oauth.fulfilled, (state, action) => {
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(oauth.rejected, (state, action) => {
        state.isLoading = false
        state.message = action.payload
      })
      .addCase(oauth.pending, (state, action) => {
        state.isLoading = true
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
