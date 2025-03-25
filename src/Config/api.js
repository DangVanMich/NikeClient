import axios from 'axios';


const request = axios.create({
    baseURL: process.env.REACT_APP_SERVER,
    headers: { 'X-Custom-Header': 'foobar' },
    withCredentials: true,
});

export default request;
