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
        config.headers['Authorization'] = getType() + ' ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    //console.log(config);
    return config;
}, err => {
    return Promise.reject(err)
})
//响应拦截
http.interceptors.response.use(res => {
    //const code = res.data.status_code || 200;
    //const msg = errorCode[code] || res.data.detail || errorCode['default']
    let datas = changearray(res.data);
    return datas
}, err => {
    const code = err.response.status;//注意：状态码是err.response.status，而不是err.status
    const msg = errorCode[code] || errorCode['default'];// || err.data.detail || errorCode['default']
    if(err.response.status == 401){
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            store.dispatch('loginOut').then(() => {
                location.href = '/login';
            })
        })
    } else if (err.response.status === 500) {
        ElMessage.error("错误500：" + msg)
    } else if (err.response.status !== 200) {
        ElMessage.error("错误：" + msg)
    } else {
        console.log('返回err');
        return err
    }
    return err
})

function changearray(arr){
    let item = JSON.stringify(arr);
    let item1 = toChineseStr(item);
    let item2 = JSON.parse(item1);
    return item2;
}

function toChineseStr(str) {//unicode转中文
    if (str == '') {//空字符串
        return '';
    }
    //例如unicode  \\u7cfb  添加了_unicode_，变成 \\u_unicode_7cfb
    //然后split('\\\\u')切分字符串生成数组，\\u_unicode_7cfb就变成了一个字符串元素：_unicode_7cfb
    //然后循环数组，当循环到这个元素时，
    //判断这个元素值含有_unicode_
    //然后把这个元素值_unicode_7cfb里面的_unicode_替换成空
    //取前面4个字符，得到了7cfb，取第四个字符后面的字符
    //把7cfb进行unicode解码，【使用string.fromCharCode( parseInt('7cfb', 16) ) + 第四个字符后面的字符】就转换成了中文
    let  unicodeStr = str;
    let reg=new RegExp('\\\\u','g')//定义要替换的字符串，g表示要全部替换掉
    let chineseStr = '';
    let itemStr = '';
    let itemStr1 = '';
    let itemStr2 = '';
    unicodeStr = unicodeStr.replace(reg,'\\u_unicode_')//执行替换，吧\\u替换成\\u_unicode_
    unicodeStr = unicodeStr.split('\\\\u');//使用split切分数组
    for (let i = 0, iLength = unicodeStr.length; i < iLength; i++) {
        if(unicodeStr[i].indexOf('_unicode_') !=-1){
            itemStr = unicodeStr[i].replace('_unicode_','');
            itemStr1 = itemStr.substring(0,4);
            itemStr2 = itemStr.substring(4);
            chineseStr += String.fromCharCode(parseInt(itemStr1, 16)) + itemStr2;
        }else{
            chineseStr += unicodeStr[i];
        }
    }
    return chineseStr;
}
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
