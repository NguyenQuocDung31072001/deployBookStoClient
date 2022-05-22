import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  genres: [],
  deletedGenres: [],
  loading: false,
  success: false,
  error: false
}

const genreSlice = createSlice({
  name: 'genreSlice',
  initialState,
  reducers: {
    genreLoading: (state, action) => {
      state.loading = true
      state.success = false
      state.error = false
    },
    genreSuccess: (state, action) => {
      state.loading = false
      state.success = true
      state.error = false
    },
    genreError: (state, action) => {
      state.loading = false
      state.success = false
      state.error = true
    },
    initGenresData: (state, action) => {
      state.genres = action.payload
      state.loading = false
      state.success = true
      state.error = false
    },
    initDeletedGenresData: (state, action) => {
      state.deletedGenres = action.payload
      state.loading = false
      state.success = true
      state.error = true
    },
    updateGenreData: (state, action) => {
      let updatedIndex = state.genres.findIndex(
        genre => genre._id === action.payload._id
      )
      let newGenresData = [...state.genres]
      console.log(updatedIndex)
      newGenresData.splice(updatedIndex, 1, action.payload)
      state.genres = newGenresData
      state.loading = false
      state.success = true
      state.error = false
    },
    addGenre: (state, action) => {
      let newGenresData = [...state.genres, action.payload]
      state.genres = newGenresData
      state.loading = false
      state.success = true
      state.error = false
    },
    softDeleteUpdate: (state, action) => {
      let newGenresData = state.genres.filter(
        genre => genre._id !== action.payload._id
      )
      let newDeletedGenresData = [...state.deletedGenres]
      newDeletedGenresData.push(action.payload)
      state.genres = newGenresData
      state.deletedGenres = newDeletedGenresData
      state.loading = false
      state.success = true
      state.error = false
    },
    hardDeleteUpdate: (state, action) => {
      let newDeletedGenresData = state.deletedGenres.filter(
        genre => genre._id !== action.payload._id
      )
      state.deletedGenres = newDeletedGenresData
    },
    restoreDeleteUpdate: (state, action) => {
      let newDeletedGenresData = state.deletedGenres.filter(
        genre => genre._id !== action.payload._id
      )
      let newGenresData = [...state.genres]
      newGenresData.push(action.payload)
      state.genres = newGenresData
      state.deletedGenres = newDeletedGenresData
      state.loading = false
      state.success = true
      state.error = false
    }
  }
})
export const {
  initGenresData,
  updateGenreData,
  addGenre,
  softDeleteUpdate,
  genreLoading,
  genreSuccess,
  genreError,
  hardDeleteUpdate,
  restoreDeleteUpdate,
  initDeletedGenresData
} = genreSlice.actions

const genreReducer = genreSlice.reducer
export default genreReducer
