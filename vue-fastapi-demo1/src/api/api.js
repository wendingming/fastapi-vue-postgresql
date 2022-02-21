import http from '../api/http.js'
//import request from '../api/request.js'
export default {
    //首页
    index(params) {
        return http.get('/', params)
    },
    //登录
    login(params) {
        return http.post('/login', params)
    },
    //管理员信息
    getInfo(params) {
        return http.get('/userinfo', params)
    }
}
