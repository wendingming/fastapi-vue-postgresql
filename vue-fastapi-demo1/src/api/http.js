// eslint-disable-next-line no-unused-vars
import Axios from 'axios'
import { getToken } from "@/common/token";
//import errorCode from '@/common/errorCode'
//import {ElMessage} from 'element-plus'
//import VueAxios from 'vue-axios'

const BaseURL = 'http://127.0.0.1:9000'
//创建http对象
let http = Axios.create({
    baseURL: BaseURL,
    headers: {
        //增加了表单application/x-www-form-urlencoded格式<<<<<<<<<<<<<注意这里
        'Content-Type': 'application/x-www-form-urlencoded;application/json;charset=utf-8'
    },
    transformRequest: [function(data) {
        let ret = ''
        for (let it in data) {//解析data并拼接
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }],
})

///请求拦截
http.interceptors.request.use(config => {
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, err => {
    return Promise.reject(err)
})
//响应拦截
http.interceptors.response.use(res => {
    if (res.status == 200) {
        //判断是否成功响应，成功响应值=1，这个响应变量，需要前后端约定好，例如code=1：代表成功，或者code=200代表成功，
        /*if(response.data.code == 200){

        }*/
        //const code = res.data.code || 200;
        //const msg = errorCode[code] || res.data.msg || errorCode['default'];
        //ElMessage.error(msg)
        return res.data;
    } else {
        return Promise.reject(res)
    }
}, err => {
    return Promise.reject(err)
})

export default {//可供调用的方法：get，post，其它自行添加
    get(url, params) {
        let config = {
            method: 'get',
            url: url
        }
        if (params) config.params = params
        return http(config)
    },
    post(url, params) {
        let config = {
            method: 'post',
            url: url,
        }
        if (params) config.data = params
        //console.log(config)
        return http(config)
    }
}
