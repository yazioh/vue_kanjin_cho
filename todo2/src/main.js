import Vue from 'vue'
// *** Bootstrap ***
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// *** Font Awesome *** 
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css'
import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css'
import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css'
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css'

// グローバルコンポーネントはこのへんで解決
import iconFont from './components/util/icon-font.vue'
import inputGroupLabel from './components/util/inputGroupLabel.vue'
console.log(inputGroupLabel)


// アプリ ルート
import App from './App'

Vue.use(BootstrapVue)

// コンポーネントのグローバル登録
Vue.component('iconFont', iconFont)
Vue.component('inputGroupLabel', inputGroupLabel)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: `<App />`
})
