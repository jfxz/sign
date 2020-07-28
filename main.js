import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App
})
Vue.prototype.$loading = (title) => {
  uni.showLoading({
  	title: title || '加载中',
		icon: 'loading',
		mask: true
  })
}
Vue.prototype.$message = (message) => {
  uni.showToast({
  	title: message,
  	duration: 2000
  })
}
app.$mount()
