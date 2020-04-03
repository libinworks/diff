import Vue from 'vue'
import App from './App.vue'
import diff from './lib/index.js'

Vue.use(diff)
new Vue({
  el: '#app',
  render: h => h(App)
})
