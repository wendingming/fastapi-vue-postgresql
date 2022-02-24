import{getToken,setToken,setTokenType,removeToken} from '@/common/token'
//挂载api接口组件
import api from '@/api/api'
//import { createSocket } from '@/common/websocket'

const user = {
    state: {//定义
        token: getToken(),
        tokentype: '',
        uid:'',                 //管理员id
        username: '',           //管理员名
        full_name: '',           //管理员全名
        avatar: '',             //管理员头像
        email:'',               //管理员邮箱
        permisson:[]            //其它备用【例如：权限】
    },
    mutations: {//赋值
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_TOKENTYPE: (state, tokentype) => {
            state.tokentype = tokentype
        },
        SET_UID: (state, uid) => {
            state.uid = uid
        },
        SET_USERNAME: (state, username) => {
            state.username = username
        },
        SET_FULLNAME: (state, full_name) => {
            state.full_name = full_name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_EMAIL:(state,email)=>{
            state.email = email
        },
        SET_PERMISSON:(state,permisson)=>{
            state.permisson = permisson
        }
    },
    actions: {//响应方法
        GetInfo({ commit, state }) {//获取管理员信息
            return new Promise((resolve, reject) => {
                api.getInfo().then(res => {
                    const user = JSON.parse(JSON.stringify(res)); //绑定管理员信息到常量
                    const avatar = user.avatar == null ? require("@/assets/img/empty-face.png") : user.avatar;//解析头像地址，没有头像则绑定一张默认头像
                    commit('SET_UID',user.uid);                     //绑定id
                    commit('SET_USERNAME', user.username)          //绑定姓名
                    commit('SET_FULLNAME', user.full_name)          //绑定全名
                    commit('SET_AVATAR', avatar)                  //绑定头像
                    commit('SET_EMAIL',user.email);               //绑定email
                    commit('SET_PERMISSON',user.permisson);       //绑定权限
                    resolve(state)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        Login({commit},userInfo){//访问登录接口
            return new Promise((resolve,reject)=>{
                api.login(userInfo).then(res=>{
                    console.log(res);
                    setToken(res.access_token);
                    setTokenType(res.token_type);
                    commit('SET_TOKEN',res.access_token)
                    commit('SET_TOKENTYPE',res.token_type)
                    resolve()
                }).catch(error=>{
                    reject(error)
                })
            })
        },
        loginOut({ commit, state }) {//退出登录
            return new Promise((resolve, reject) => {
                console.log(state);
                console.log(reject);
                commit('SET_TOKEN', '');
                commit('SET_TOKENTYPE','')
                commit('SET_UID','');
                commit('SET_USERNAME','');
                commit('SET_FULLNAME','');
                commit('SET_AVATAR','');
                commit('SET_EMAIL','');
                commit('SET_ACCOUNT','');
                commit('SET_PERMISSON',[]);
                removeToken();
                resolve();
            })
        },
    }
}
export default user
