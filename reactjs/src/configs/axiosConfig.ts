import axios from 'axios';
const token = localStorage.getItem('access_token');
console.log(token)

export const axiosConfig = axios.create({
    baseURL:'http://localhost:3333',
    timeout: 1000,
    headers: { 'Authorization': 'Bearer ' + token }
})