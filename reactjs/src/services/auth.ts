import axios from 'axios';

export const register = async (username:string,password:string)=> {
    const result = await axios.post('http://localhost:3333/user/register',{username,password})
    return result.data
}
export const login = async (username:string,password:string)=> {
    const result = await axios.post('http://localhost:3333/user/login',{username,password})
    return result.data
}