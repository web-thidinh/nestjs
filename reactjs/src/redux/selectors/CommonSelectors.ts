import { useAppSelector } from "../hooks";

export const useIsLogin = ()=> useAppSelector((state)=>{
    console.log(state)
    return state.common.isLogin
})