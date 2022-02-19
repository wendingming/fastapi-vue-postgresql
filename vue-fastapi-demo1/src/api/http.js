// eslint-disable-next-line no-unused-vars
import Axios from 'axios'
import store from '@/store'
import { getToken, getType } from "@/common/token";
import errorCode from '@/common/errorCode'
import {ElMessageBox,ElMessage} from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
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
    timeout: 10000
})

///请求拦截
http.interceptors.request.use(config => {
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = getType() + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, err => {
    return Promise.reject(err)
})
//响应拦截
http.interceptors.response.use(res => {
    const code = res.data.status_code || 200;
    const msg = errorCode[code] || res.data.detail || errorCode['default']
    if (code === 401) {
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            store.dispatch('loginOut').then(() => {
                location.href = '/index';
            })
        })
    } else if (code === 500) {
        ElMessage.error(msg)
        return Promise.reject(new Error(msg))
    } else if (code !== 200) {
        ElMessage.error(msg)
        return Promise.reject('error')
    } else {
        return res.data
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
