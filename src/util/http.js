import axios from 'axios';
import { store } from '../redux/store'
import { changeLoading } from '../redux/actions'
axios.defaults.baseURL = "http://localhost:5000"
axios.interceptors.request.use(function (config) {
    //在发送请求之前做些什么Do something before request is sent
    store.dispatch(changeLoading(true))
    return config;
}, function (error) {
    //处理请求错误 Do something with request error
    return Promise.reject(error);
});

// 添加响应拦截器Add a response interceptor
axios.interceptors.response.use(function (response) {
    //位于2xx范围内的Ny状态码会触发该函数 Any status code that lie within the range of 2xx cause this function to trigger
    //处理响应数据Do something with response data
    store.dispatch(changeLoading(false))
    return response;
}, function (error) {
    //任何不在2xx范围内的状态码都会触发这个函数 Any status codes that falls outside the range of 2xx cause this function to trigger
    // 处理响应错误 Do something with response error
    store.dispatch(changeLoading(false))
    return Promise.reject(error);
});