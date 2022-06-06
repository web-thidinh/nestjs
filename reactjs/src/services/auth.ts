import axios from 'axios';

export const register = async (username:string,password:string)=> {
    const result = await axios.post('http://localhost:3333/user/register',{username,password});
    return result.data;
}
export const login = async (username:string,password:string)=> {
    const result = await axios.post('http://localhost:3333/user/login',{username,password});
    console.log(result);
    return result.data;
}
export const loginRichClient = async ()=> {
    const result = await axios.post('http://localhost:3333/rich/login');
    return result.data;
}
export const loginWithGoogle = async (inputToken: string)=> {
    const result = await axios.post('http://localhost:3333/react-google-login',{
        token: inputToken
    });
    return result.data;
}

export const loginWithFacebook = async (userID: string, token: string)=>{
    const result = await axios.post(`http://localhost:3333/react-facebook-login`,{
        userID,token
    });
    return result.data;
}