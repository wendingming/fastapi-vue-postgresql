import router from '@/router'
import store from '@/store'
import {Message} from 'element-ui'
import {getToken} from '@/common/token'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
	showSpinner: true
})
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {

	NProgress.start()
	if (getToken()) {
		if (to.path === '/login') {
			next({
				path: '/'
			})
			NProgress.done()
		} else {
			//console.log(store.state.member.perms);
			if (store.state.member.perms.length === 0) {
				store.dispatch('GetInfo').then(res => {

					store.dispatch('GenerateRoutes').then(accessRoutes => {
						//console.log(router.options.routes)
						router.addRoutes(accessRoutes)
						next({ ...to, replace: true })

				  })
				}).catch(err => {
					store.dispatch('loginOut').then((err) => {
						Message.error(err)
						next({
							path: '/'
						})
					})
				})
				store.dispatch('GetNoticeMessage');
			}else{
				next();
			}


		}
	} else {
		if (whiteList.indexOf(to.path) !== -1) {
			next()
		} else {
			next(`/login?redirect=${to.fullPath}`)
			NProgress.done();
		}
	}
})
router.afterEach(() => {
	NProgress.done()
})
