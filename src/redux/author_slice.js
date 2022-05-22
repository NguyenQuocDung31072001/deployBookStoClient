import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  authors: [],
  deletedAuthors: [],
  loading: false,
  success: false,
  error: false
}

const authorSlice = createSlice({
  name: 'authorSlice',
  initialState,
  reducers: {
    authorLoading: (state, action) => {
      state.loading = true
      state.success = false
      state.error = false
    },
    authorSuccess: (state, action) => {
      state.loading = false
      state.success = true
      state.error = false
    },
    authorError: (state, action) => {
      state.loading = false
      state.success = false
      state.error = true
    },
    initAuthorData: (state, action) => {
      state.authors = action.payload
      state.loading = false
      state.success = true
      state.error = false
    },
    initDeletedAuthorData: (state, action) => {
      state.deletedAuthors = action.payload
      state.loading = false
      state.success = true
      state.error = true
    },
    updateAuthorData: (state, action) => {
      let updatedIndex = state.authors.findIndex(author => author._id === action.payload._id)
      let newAuthorsData = [...state.authors]
      newAuthorsData.splice(updatedIndex, 1, action.payload)
      state.authors = newAuthorsData
      state.loading = false
      state.success = true
      state.error = false
    },
    addAuthor: (state, action) => {
      let newAuthorsData = [...state.authors, action.payload]
      state.authors = newAuthorsData
      state.loading = false
      state.success = true
      state.error = false
    },
    softDeleteAuthorUpdate: (state, action) => {
      let newAuthorsData = state.authors.filter(author => author._id !== action.payload._id)
      let newDeletedAuthorsData = [...state.deletedAuthors]
      newDeletedAuthorsData.push(action.payload)
      state.authors = newAuthorsData
      state.deletedAuthors = newDeletedAuthorsData
      state.loading = false
      state.success = true
      state.error = false
    },
    hardDeleteAuthorUpdate: (state, action) => {
      let newDeletedAuthorsData = state.deletedAuthors.filter(
        author => author._id !== action.payload._id
      )
      state.deletedAuthors = newDeletedAuthorsData
      state.loading = false
      state.success = true
      state.error = false
    },
    restoreDeletedAuthorUpdate: (state, action) => {
      let newDeletedAuthorsData = state.deletedAuthors.filter(
        author => author._id !== action.payload._id
      )
      let newAuthorsData = [...state.authors]
      newAuthorsData.push(action.payload)
      state.authors = newAuthorsData
      state.deletedAuthors = newDeletedAuthorsData
      state.loading = false
      state.success = true
      state.error = false
    }
  }
})

export const {
  authorLoading,
  authorSuccess,
  authorError,
  initAuthorData,
  initDeletedAuthorData,
  addAuthor,
  updateAuthorData,
  softDeleteAuthorUpdate,
  hardDeleteAuthorUpdate,
  restoreDeletedAuthorUpdate
} = authorSlice.actions

const authorReducer = authorSlice.reducer
export default authorReducer
