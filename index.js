/*
 * @Author: xiaojun
 * @Date: 2024-05-14 17:30:36
 * @LastEditors: xiaojun
 * @LastEditTime: 2024-05-15 17:03:05
 * @Description: 对应操作
 */
// utils.js remains the same

// vite-plugin.js
const { parse } = require('@vue/compiler-sfc');
const {
  generateScriptcCode,
  generateLabelCode,
  generateStyleCode,
  getPagesMap,
  initPages,
  getRoute,
} = require('./utils');

let _init = false;
let needHandle = false;
let pagesMap = {};

function generateHtmlCode(str, tagName, contentToAdd) {  
  // 创建一个正则表达式来匹配开始标签，并捕获其属性（如果有的话）  
  const regex = new RegExp(`<(${tagName})(.*?)>`);
  // 替换匹配到的标签，在标签内部添加新的内容  
  return str.replace(regex, `<$1$2>${contentToAdd}`);  
}

const myVitePlugin = {
  name: 'vue3-inset-loader',
  transform(code, id) {
    if (!_init) {
      _init = true;
      init(this);
    }

    const route = getRoute(id);
    const curPage = pagesMap[route];
    if (id.endsWith('.vue') && needHandle &&curPage) {
      try {
        const compiler = parse(code);
        const labelCode = generateLabelCode(curPage.label);
        let templateCode = compiler.descriptor && compiler.descriptor.template ? compiler.descriptor.template.content : '';
        // 挂在根标签上
        if (curPage.ele) {
          // 匹配标签位置
          // const insertReg = new RegExp(`(<\/${curPage.ele}>$)`)
          // 在匹配的标签之前插入额外标签代码
          templateCode = generateHtmlCode(
            templateCode,
            curPage.ele,
            labelCode
          )
        } else {
          templateCode = labelCode + templateCode;
        }
        
        const style = generateStyleCode(compiler.descriptor && compiler.descriptor.styles ? compiler.descriptor.styles : []);
        const script = generateScriptcCode(code);
      // 重组style标签及内容
        code = `
          <template>
            ${templateCode}
          </template>
          ${script}
          ${style}
        `;
      } catch (e) {
        console.log(e);
      }
    }
    return {
    code,
    map: null // 表示源码视图不作修改
    }
  },
};

function init(that) {
  needHandle = initPages(that);
  // Convert to a mapping object of routes and configurations
  if (needHandle) {
    pagesMap = getPagesMap();
  }
}

module.exports = myVitePlugin;
