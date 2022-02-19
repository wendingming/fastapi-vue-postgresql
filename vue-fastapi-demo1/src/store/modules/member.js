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
        fullname: '',           //管理员全名
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
        SET_FULLNAME: (state, fullname) => {
            state.fullname = fullname
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
        /*GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(res => {
                    //console.log(res);
                    const user = res.data.userInfo;               //绑定管理员信息到常量
                    const avatar = user.avatar == null ? require("@/assets/img/empty-face.png") : user.avatar;//解析头像地址，没有头像则绑定一张默认头像
                    commit('SET_USERNAME', user.username)                //绑定姓名
                    commit('SET_AVATAR', avatar)                  //绑定头像
                    commit('SET_UID',user.id);                     //绑定id
                    commit('SET_EMAIL',res.data.email);           //绑定email
                    commit('SET_PERMISSON',res.data.perms);       //绑定权限
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },*/
        Login({commit},userInfo){//访问登录接口
            console.log('开始登录');
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
