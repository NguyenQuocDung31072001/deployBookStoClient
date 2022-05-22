import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search:{
    query:{
      
    },
    type:''
  },

}

const searchSlice = createSlice({
  name: 'searchQuery',
  initialState,
  reducers: {
    updateQuery: (state, actions) => {
      state.search=actions.payload
    }
  }
})
export const { updateQuery } = searchSlice.actions

export default searchSlice.reducer
