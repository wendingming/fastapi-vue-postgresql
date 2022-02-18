import axios from 'axios'
import {ElMessageBox,ElMessage} from 'element-plus'
import store from '@/store'
import {getToken} from '@/common/token'
import errorCode from '@/common/errorCode'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const service = axios.create({
    baseURL: process.env.VUE_APP_API,       //指向根目录.env文件定义的地址：VUE_APP_API = "http://127.0.0.1:9000"
    timeout: 10000                          //定义超时时间
})
service.interceptors.request.use(config => {
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, error => {
    Promise.reject(error)
})

service.interceptors.response.use(res => {

    const code = res.data.code || 200;
    const msg = errorCode[code] || res.data.msg || errorCode['default']
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
}, error => {
    console.log('err' + error)
    let {message} = error;
    if (message == "Network Error") {
        message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage.error(message)
    return Promise.reject(error)
})
export default service
