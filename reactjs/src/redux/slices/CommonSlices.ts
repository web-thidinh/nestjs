import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface CounterState {
    isLogin: boolean
}

const initialState: CounterState = {
    isLogin: false
}

export const commonSlices = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload
    },
  },
})

export const { setIsLogin } = commonSlices.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.common.isLogin

export default commonSlices.reducer