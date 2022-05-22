import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  breadcrumb: {
    genre_name:'',
    genre_slug: '',
    name_book: ''
  }
}

const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    updateBreadcrumb: (state, actions) => {
      state.breadcrumb = actions.payload
    }
  }
})
export const { updateBreadcrumb } = breadcrumbSlice.actions

export default breadcrumbSlice.reducer
