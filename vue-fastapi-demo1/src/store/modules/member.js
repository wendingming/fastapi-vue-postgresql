import{getToken,setToken,removeToken} from '@/common/token'
//login接口
//import api from '@/api/api'
//import {getInfo} from '@/api/api'
//import { createSocket } from '@/common/websocket'

const user = {
    state: {//定义
        token: getToken(),
        name: '',               //管理员名
        avatar: '',             //管理员头像
        uid:'',                 //管理员id
        acount:'',              //管理员登录用户名
        email:'',               //管理员邮箱
        perms:[]                //其它备用【例如：权限】
    },
    mutations: {//赋值
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ID:(state,uid)=>{
            state.uid = uid
        },
        SET_EMAIL:(state,email)=>{
            state.email = email
        },
        SET_ACCOUNT:(state,acount)=>{
            state.acount = acount
        },
        SET_PERMISSON:(state,perms)=>{
            state.perms = perms
        }
    },
    actions: {//响应方法
        /*GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(res => {
                    //console.log(res);
                    const user = res.data.userInfo;               //绑定管理员信息到常量
                    const avatar = user.avatar == null ? require("@/assets/img/empty-face.png") : user.avatar;//解析头像地址，没有头像则绑定一张默认头像
                    commit('SET_NAME', user.uname)                //绑定姓名
                    commit('SET_AVATAR', avatar)                  //绑定头像
                    commit('SET_ID',user.id);                     //绑定id
                    commit('SET_EMAIL',res.data.email);           //绑定email
                    commit('SET_ACCOUNT',res.data.account);       //绑定account
                    commit('SET_PERMISSON',res.data.perms);       //绑定权限
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },*/
        Login({commit},userInfo){//访问登录接口
            let data = userInfo;
            setToken(data)
            commit('SET_TOKEN',data)
            /*api.login(userInfo).then((res) => {//访问接口，并把获取的数据复制给FirstSting变量
                setToken(res.data)
                commit('SET_TOKEN',res.data)
                data = res;
            }).catch(err=>{
                console.log(err)
            });*/
            return data;
            /*return new Promise((resolve,reject)=>{
                login(userInfo).then(res=>{
                    //console.log(res);
                    setToken(res.data)
                    commit('SET_TOKEN',res.data)
                    //登录成功后建立连接【暂时没用websock】
                    //createSocket('ws://127.0.0.1:2348')
                    resolve()
                }).catch(error=>{
                    reject(error)
                })
            })*/
        },
        loginOut({ commit, state }) {//退出登录
            return new Promise((resolve, reject) => {
                console.log(state);
                console.log(reject);
                commit('SET_TOKEN', '');
                commit('SET_NAME','');
                commit('SET_AVATAR','');
                commit('SET_ID','');
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
