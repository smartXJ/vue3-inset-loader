
# vue3-inset-loader
#### 编译阶段在sfc模板指定位置插入自定义内容，适用于vite构建的vue应用，常用于小程序需要全局引入组件的场景。（由于小程序没有开放根标签，没有办法在根标签下追加全局标签，所以要使用组件必须在当前页面引入组件标签）
因为 [vue-inset-loader](https://github.com/1977474741/vue-inset-loader) 不支持vue3 + vite ，我就改了下，现在只支持 vue3 + vite了
### 第一步 安装

#### 将文件放在 plugins/vue3-inset-loader 下

#### 安装依赖
```
pnpm i strip-json-comments@3.1.1 @vue/compiler-sfc -D
```

### 第二步 vite.config.js注入loader
```
import { defineConfig } from 'vite'
import vue3InsetLoaderPlugin from './plugins/vue3-inset-loader'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
  },
  plugins: [
    // 注入loader，放在plugins的首位
    vue3InsetLoaderPlugin
  ],
})
```
### 第三步 pages.json配置文件中添加insetLoader
```

    "insetLoader": {
        "config":{
            "confirm": "<BaseConfirm ref='confirm'></BaseConfirm>",
            "abc": "<BaseAbc ref='BaseAbc'></BaseAbc>"
        },
        // 全局配置
        "label":["confirm"]
        "rootEle":"view"
    },
    "pages": [
        {
            "path": "pages/tabbar/index/index",
            "style": {
                "navigationBarTitleText": "测试页面",
                // 单独配置，用法跟全局配置一致，优先级高于全局
                "label": ["confirm","abc"],
                "rootEle":"view"
            }
        },
    ]
```
###  配置说明

 - `config` (default: `{}`)
    定义标签名称和内容的键值对
 - `label`(default: `[]`)
    需要全局引入的标签，打包后会在所有页面引入此标签
 - `rootEle`(default: ``)
    目标元素的标签类型，没有时直接放在元素上面（存在rootEle属性时则挂载到该元素中）

 ✔ `label` 和 `rootEle`支持在单独页面的style里配置，优先级高于全局配置

### 一些问题的解决
<span style="color:red">Unexpected token } in JSON at position 256</span>，如果出现运行发现这样的错误，请删除pages.json文件 多余的空格
