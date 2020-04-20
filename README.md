# diff

> 新旧版本的对比，突出差异，使用canvas的贝塞尔曲线连接

## 引入方式

> npm install li-diff --save

1. 全局引入
``` bash
import diff from 'li-diff'

Vue.use(diff)
```

> 可用全局方法 this.$diffJson(oldStr, newStr)

2. 局部引入
``` bash
import diff from 'li-diff'

components: { diff }
```
## 参数
1. API

参数 | 类型 | 默认值 | 说明
-|-|-|-
oldContent | string | 无 | 旧内容 |
newContent | string | 无 | 新内容 |
diffBoxStyle | object | {} | 最外层盒子样式 |
2. 事件

事件名 | 说明 | 回调参数
-|-|-
diffJson | 差异结果 | function(json)

``` bash
json.canvasJson canvas画图的json
```
``` bash
json.differenceJson 对比结果的json
> add 新增 key为行号
> cols 新增 列 及内容
> newRow 是否为 整行新增
```