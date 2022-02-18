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
    }
    /*login(params) {
        return request({
            url: '/login',
            method: 'post',
            data: params
        })
    }*/
}
