import  { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid,Button, TextField } from '@mui/material';
import styles from './Login.module.scss';
import { register, login } from '../../services/auth';
import { useAppDispatch } from '../../redux/hooks';
import { setIsLogin } from '../../redux/slices/CommonSlices';


const Login : FunctionComponent = ()=> {
    const dispatch = useAppDispatch()
    const [isLoginBtn, setIsLoginBtn] = useState(true);
    const [email,setEmail] = useState('test@gmail.com');
    const [password,setPassword] = useState('Asdfgh1@3');
    const handleRegister = async ()=> {
        const result = await register(email,password);
        setEmail('');
        setPassword('');
        console.log(result);
    }
    const handelLogin = async ()=>{
        const result = await login(email,password);
        dispatch(setIsLogin(true));
        console.log(result);
    }
    return (
        <Grid 
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid className={styles.loginGroup} mb={3}>
                <TextField 
                    id="outlined-basic" 
                    className={styles.loginInput} 
                    value={email} 
                    onChange={(e)=>{
                        setEmail(e.target.value)
                    }} 
                    label="Email" 
                    variant="outlined" />
            </Grid>
            <Grid className={styles.loginGroup} mb={3}>
                <TextField 
                    id="outlined-basic" 
                    className={styles.loginInput} 
                    value={password} 
                    onChange={(e)=>{
                        setPassword(e.target.value)
                    }} 
                    label="Password" 
                    variant="outlined" />
            </Grid>
            <Grid className={`${styles.loginGroup} ${styles.forgotPassword}`} mb={3}>
                <Link to='forgot-password'>
                    {isLoginBtn
                        ? 'Forgot password?'
                        : 'You already have account?'
                    }
                </Link>
                <div onClick={()=>{setIsLoginBtn(!isLoginBtn)}}>
                    <span>
                        {isLoginBtn
                            ? 'Register'
                            : 'Login'
                        }
                    </span>
                </div>
            </Grid>
            <Grid className={styles.loginGroup}>
                {isLoginBtn
                    ?(<Button 
                        className={styles.loginButton} 
                        onClick={handelLogin}
                        variant="contained"
                    >
                        Login
                    </Button>)
                    :(<Button 
                        className={styles.loginButton} 
                        onClick={handleRegister} 
                        variant="contained"
                    >
                        Register
                    </Button>)
                }
            </Grid>
        </Grid>
    )
}

export default Login