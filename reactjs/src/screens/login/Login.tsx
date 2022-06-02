import  { FunctionComponent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid,Button, TextField } from '@mui/material';
import styles from './Login.module.scss';
import { register, login, loginRichClient, loginWithGoogle } from '../../services/auth';
import { useAppDispatch } from '../../redux/hooks';
import { setIsLogin } from '../../redux/slices/CommonSlices';
import GoogleLogin from 'react-google-login';


const Login : FunctionComponent = ()=> {

    const dispatch = useAppDispatch()
    const [hasError, setHasError] = useState<string | undefined>();
    const [isLoginBtn, setIsLoginBtn] = useState(true);
    const [email,setEmail] = useState('test@gmail.com');
    const [password,setPassword] = useState('Asdfgh1@3');

    const handleRegister = async ()=> {
        const result = await register(email,password);
        const error = result?.response?.error
        if(error){
            setHasError(result?.message);
            return;
        }
        setEmail('');
        setPassword('');
        setIsLoginBtn(!isLoginBtn);
    }

    const handelLogin = async ()=>{
        const result = await login(email,password);
        console.log('Result:',result);
        const error = result?.data?.access_token
        if(error){
            dispatch(setIsLogin({isLogin:true,user:{email:result?.data?.email}}));
            localStorage.setItem('common',JSON.stringify({isLogin:true,user:{email:result?.data?.email}}));
        }
        setHasError(result?.message);
    }

    const hideErrorMessage = ()=>{
        setHasError(undefined);
    }

    const renderError = useMemo(()=>{
        if(!hasError) return;
        return (
            <div className={styles.loginError}>
                <span>{hasError}</span>
            </div>
        )
    },[hasError])

    const handleGoogleLogin = async () => {
        window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: async (res: any)=>{
                const data = await loginWithGoogle(res.credential);
                console.log(data);
                const tokenData = data?.data?.access_token
                if(tokenData){
                    dispatch(setIsLogin({isLogin:true,user:{email:data?.data?.email}}));
                    localStorage.setItem('auth',JSON.stringify({isLogin:true,user:{email:data?.data?.email,access_token:tokenData}}));
                }
                else{
                    dispatch(setIsLogin({isLogin:false,user:{}}));
                }
            },
        });
        window.google.accounts.id.prompt();
    }

    const handleLoginFacebook = async ()=>{
        window.FB.login(function(response: any){
            console.log(response)
            // handle the response 
        });
    }
    
    // const handleLoginGoogle = async ()=>{
    //     const screenWidth = window.innerWidth;
    //     const screenHeight = window.innerHeight;
    //     const popUpWidth = screenWidth / 2;
    //     const popUpHeight = screenHeight - 80;
    //     const popUpLeft = screenWidth/4;
        
    //     const gooleLoginUrl = 'http://localhost:3333/google/login';
    //     const GoogleLoginWindow = window.open(
    //         gooleLoginUrl,
    //         "_parent",
    //         `toolbar=yes,scrollbars=yes,resizable=yes,top=150,left=${popUpLeft},width=${popUpWidth},height=${popUpHeight}`
    //     );

    //     console.log(GoogleLoginWindow);
    // };

    // const handleLogin = async (googleData: any) => {
    //     console.log(googleData.tokenId)
    //     const res = await fetch('/api/google-login', {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         token: googleData.tokenId,
    //       }),
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });
    
    //     const data = await res.json();
    //     // setLoginData(data);
    //     localStorage.setItem('loginData', JSON.stringify(data));
    // };

    // const handleSuccess = (result: any) => {
    //     console.log(result);
    // };

    // const handleFailure = (result: any) => {
    //     console.log(result);
    // };

    return (
        <Grid 
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            className={styles.loginPage}
        >
            <Grid className={styles.loginGroup} mb={5}>
                {renderError}
                <TextField 
                    id="outlined-basic" 
                    className={styles.loginInput} 
                    value={email} 
                    onFocus={hideErrorMessage}
                    onChange={(e: any)=>{
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
                    onFocus={hideErrorMessage}
                    onChange={(e:any)=>{
                        setPassword(e.target.value)
                    }} 
                    label="Password" 
                    variant="outlined" />
            </Grid>
            <Grid className={`${styles.loginGroup} ${styles.forgotPassword}`} mb={3}>
                {isLoginBtn
                    ? <Link to='forgot-password'>Forgot password?</Link>
                    : <div>You already have account?</div>
                }
                <div className={`${styles.register}`} onClick={()=>{setIsLoginBtn(!isLoginBtn)}}>
                    {isLoginBtn
                        ? 'Register'
                        : 'Login'
                    }
                </div>
            </Grid>
            <Grid className={styles.loginGroup} mb={3}>
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
            {/* <Grid className={styles.loginGroup} mb={3}>
                <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
                        className={`${styles.loginSocialButton}`}
                        buttonText="Log in with Google"
                        onSuccess={handleLogin}
                        onFailure={handleFailure}
                        cookiePolicy={'single_host_origin'}
                    >
                </GoogleLogin>
            </Grid> */}
            <Grid className={styles.loginGroup} mb={3}>
                <Button 
                    className={`${styles.loginButton, styles.loginSocialButton}`} 
                    onClick={handleGoogleLogin} 
                    variant="contained"
                >
                    Login with Google
                </Button>
            </Grid>
            <Grid className={styles.loginGroup} mb={3}>
                <Button 
                    className={`${styles.loginButton, styles.loginSocialButton}`} 
                    onClick={handleLoginFacebook} 
                    variant="contained"
                >
                    Login with Facebook
                </Button>
            </Grid>
        </Grid>
    )
}

export default Login