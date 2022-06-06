import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { Link } from 'react-router-dom';
import styles from './Login.module.scss';
import GoogleLogo from '../../images/google.png';
import { isEmail } from '../../helper/validation';
import { useAppDispatch } from '../../redux/hooks';
import FacebookLogo from '../../images/facebook.png';
import { Grid,Button, TextField } from '@mui/material';
import { setIsLogin } from '../../redux/slices/CommonSlices';
import { register, login, loginWithGoogle, loginWithFacebook } from '../../services/auth';


const Login : FunctionComponent = ()=> {

    const dispatch = useAppDispatch();
    const [isLoginBtn, setIsLoginBtn] = useState<boolean>(true);
    const [fbToken,setFbToken] = useState<string | undefined>();
    const [hasError, setHasError] = useState<string | undefined>();
    const [fbUserId,setFbUserId] = useState<string | undefined>();
    const [email,setEmail] = useState<string>('test@gmail.com');
    const [password,setPassword] = useState<string>('Asdfgh1@3');

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
        if(email === '' || password === ''){
            setHasError('Email or password can not empty!');
        }
        else{
            const result = await login(email,password);
            console.log('Result:',result);
            const token = result?.data?.user?.access_token;
            if(token){
                dispatch(setIsLogin({isLogin:true,user:{email:result?.data?.user?.email}}));
                localStorage.setItem('access_token',JSON.stringify(result?.data?.user?.access_token));
                localStorage.setItem('auth',JSON.stringify({isLogin:true,user:{email:result?.data?.user?.email}}));
            }
            else{
                setHasError(result?.message);
            }
        }
    }

    const validateEmail = (emailInput: string)=>{
        if(emailInput.length && !isEmail(emailInput)){
            setHasError('Invalid email address')
        }
    }

    const debounceValidateEmail = useCallback(debounce(validateEmail,1000),[])

    useEffect(()=>{
        setHasError(undefined);
        debounceValidateEmail(email);
    },[email])

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
                const tokenData = data?.data?.user?.access_token
                if(tokenData){
                    dispatch(setIsLogin({isLogin:true,user:{email:data?.data?.user?.email}}));
                    localStorage.setItem('access_token',JSON.stringify(data?.data?.user?.access_token));
                    localStorage.setItem('auth',JSON.stringify({isLogin:true,user:{email:data?.data?.user?.email,access_token:tokenData}}));
                }
                else{
                    dispatch(setIsLogin({isLogin:false,user:{}}));
                }
            },
        });
        window.google.accounts.id.prompt();
    }

    const handleDataFacebookLogin = async ()=> {
        console.log(fbUserId,fbToken);
        const result = await loginWithFacebook(fbUserId!,fbToken!);
        console.log('Get facebook data:',result);
        if(result){
            const token = result?.data?.user?.access_token;
            console.log('fb token:',token)

            if(token){
                dispatch(setIsLogin({isLogin:true,user:{email:result?.data?.user?.email}}));
                localStorage.setItem('access_token',JSON.stringify(result?.data?.user?.access_token));
                localStorage.setItem('auth',JSON.stringify({isLogin:true,user:{email:result?.data?.user?.email}}));
            }
            else{
                dispatch(setIsLogin({isLogin:false,user:{}}));
            }
        }
    }

    const handleFacebookLogin = async ()=>{

        await window.FB.init({
            appId            : process.env.REACT_APP_FACEBOOK_APP_ID,
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v14.0'
        });

        await window.FB.login((response: any) => {
            console.log(response);
            if (response.authResponse) {
                const responseUserId = response?.authResponse?.userID;
                const responseToken = response?.authResponse?.accessToken;
                setFbToken(responseToken);
                setFbUserId(responseUserId);
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    };

    useEffect(()=>{
        if(fbUserId === undefined || fbToken === undefined){
            return;
        }
        else{
            handleDataFacebookLogin();
        }
    },[fbUserId,fbToken])

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
            <Grid className={styles.loginGroup} mb={3}>
                <button 
                    className={`${styles.loginButton} ${styles.loginSocialButton}`} 
                    onClick={handleGoogleLogin}
                >
                    <img src={GoogleLogo} alt="" />
                    Login with Google
                </button>
            </Grid>
            <Grid className={styles.loginGroup} mb={3}>
                <button 
                    className={`${styles.loginButton} ${styles.loginSocialButton}`}
                    onClick={handleFacebookLogin}
                >
                    <img src={FacebookLogo} alt="" />
                    Login with Facebook
                </button>
            </Grid>
        </Grid>
    )
}

export default Login