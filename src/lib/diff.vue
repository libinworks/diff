<template>
  <div id="diff-box" :style="diffBoxStyle">
    <div class="old_info" id="old_info">
      <p
        v-for="(item, index) in oldStr"
        :class="item.indexOf('span>') > 0 ? 'del_line' : ''"
        :key="'old_'+index"
        v-html="item"
      ></p>
      <p style="min-height: 0;"></p>
    </div>
    <div class="canvas_box" id="canvas_box">
      <canvas style="position: absolute;top: 0;left: 0;" id="canvas" width="30" height="100%">浏览器不兼容</canvas>
    </div>
    <div class="new_info" id="new_info">
      <p
        v-for="(item, index) in newStr"
        :class="item.indexOf('span>') > 0 ? 'add_line' : ''"
        :key="'new_'+index"
        v-html="item"
      ></p>
      <p style="min-height: 0;"></p>
    </div>
  </div>
</template>
<script>
import { diffJson, diffAddSpan, diffScroll } from './diff'
export default {
  name: 'diff',
  props: {
    newContent: {
      type: String,
      default: ''
    },
    oldContent: {
      type: String,
      default: ''
    },
    diffBoxStyle: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      newStr: '',
      oldStr: '',
      canvasNum: 200
    }
  },
  mounted() {
    this.diffShow()
  },
  methods: {
    diffShow () {
      const _this = this
      const newStr = _this.newContent
      const oldStr = _this.oldContent
      const { differenceJson, canvasJson } = diffJson(oldStr, newStr)
      this.$emit('diffJson', differenceJson)
      const removeObj = differenceJson.remove
      const addObj = differenceJson.add
      _this.oldStr = diffAddSpan(removeObj, oldStr)
      _this.newStr = diffAddSpan(addObj, newStr)

      this.canvas(canvasJson)
    },
    canvas (canvasJson) {
      var _this = this
      try {
        diffScroll(canvasJson)
        _this.canvasNum = 200
      } catch (error) {
        _this.canvasNum --
        if (_this.canvasNum > 0) {
          setTimeout(() => {
            _this.canvas (canvasJson)
          }, 50)
        }
      }
    }
  }
}
</script>

<style>
#diff-box{
  display: flex;
  height: 100%;
  font-size: 16px;
  overflow: hidden;
}
.old_info, .new_info{
  flex: 1;
  border: 1px solid #ebebeb;
  height: 100%;
  background: #fff;
  overflow-y: auto;
  position: relative;
  padding: 10px 0;
  word-break: break-all;
  line-height: 1.8;
  box-sizing: border-box;
}
.canvas_box{
  width: 30px;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.old_info p, .new_info p{
  margin: 0;
  padding: 0 10px;
  min-height: 28px;
}
.old_info .del_line{
  display: flex;
  flex-wrap: wrap;
  background-color: #fee8e9;
  letter-spacing: 2px;
}
.old_info .del_line span{
  display: inline-block;
  min-width: 9px;
  min-height: 28px;
  background-color: #ffb6ba !important;
}
.new_info .add_line{
  display: flex;
  flex-wrap: wrap;
  background-color: #dfd;
  letter-spacing: 2px;
}
.new_info .add_line span{
  display: inline-block;
  min-width: 9px;
  min-height: 28px;
  background-color: #97f295 !important;
}
</style>
<style scoped>
::-webkit-scrollbar-track{
  border-radius: 4px;
  background-color: #fff;
}
::-webkit-scrollbar{
  width: 4px;
  background-color: #fff;
}
::-webkit-scrollbar-thumb{
  border-radius: 4px;
  background-color: #ebebeb;
}
</style>