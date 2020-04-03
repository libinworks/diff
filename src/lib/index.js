import diff from './diff.vue' // 导入组件
diff.install = function (Vue) {
    Vue.component('diff', diff)
    if (typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(diff)
    }
}
export default diff
