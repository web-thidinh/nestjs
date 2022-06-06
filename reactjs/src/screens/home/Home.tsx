import { FunctionComponent } from 'react';
import { Grid,Button, TextField } from '@mui/material';
import { setIsLogin } from '../../redux/slices/CommonSlices';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const HomeScreen: FunctionComponent = ()=> {

    const dispatch = useAppDispatch();
    const userLogged = useAppSelector(state => state.common.user.email)

    const handleLogout = ()=>{
        localStorage.removeItem('auth');
        localStorage.removeItem('access_token');
        dispatch(setIsLogin({isLogin:false,user:{}}));
    }

    return (
        <Grid container justifyContent="space-between" alignItems="center" height={50} pl={4} pr={4}>
            <Grid>
                Home screen
            </Grid>
            <Grid justifyContent="space-between" alignItems="center">
                <div>{userLogged}</div>
                <button onClick={handleLogout}>
                    SignOut
                </button>
            </Grid>
        </Grid>
    )
}

export default HomeScreen