import type { RootState } from '../store';
import { PayloadCommon } from '../interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const authLocal = JSON.parse(localStorage.getItem('auth')!);
interface CounterState {
    isLogin: boolean
    user: object
}

const initialState: CounterState = {
    isLogin: authLocal ? authLocal.isLogin : false,
    user: authLocal ? authLocal.user : {}
}

export const commonSlices = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<PayloadCommon>) => {
      state.isLogin = action.payload.isLogin
      state.user = action.payload.user
    },
  },
})

export const { setIsLogin } = commonSlices.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.common.isLogin

export default commonSlices.reducer