import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allBookBought:[],
    allBookReview:[]
}

const bookBoughtSlice = createSlice({
  name: 'bookBoughtQuery',
  initialState,
  reducers: {
    getAllBookBought: (state, actions) => {
      state.allBookBought=actions.payload
    },
    getAllBookReview:(state,actions)=>{
      state.allBookReview=actions.payload
    },
    cleanBookBought:(state,actions)=>{
      state.allBookBought=[]
      state.allBookReview=[]
    }
  }
})
export const { getAllBookBought,getAllBookReview,cleanBookBought} = bookBoughtSlice.actions

export default bookBoughtSlice.reducer
