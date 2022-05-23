import axios from 'axios';

export const register = async (email:string,password:string)=> {
    const result = await axios.post('http://localhost:3333/user/register',{email,password})
    return result.data
}
export const login = async (email:string,password:string)=> {
    const result = await axios.post('http://localhost:3333/user/login',{email,password})
    return result.data
}