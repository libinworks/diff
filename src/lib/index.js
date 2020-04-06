import diff from './diff.vue' // 导入组件
import { diffJson } from './diff.js'
diff.install = function (Vue) {
  Vue.component('diff', diff)
  Vue.mixin({
    methods: {
      $diffJson (a, b) {
        return diffJson(a, b)
      }
    }
  })
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(diff)
  }
}
export default diff
