/*
 * @Author: xiaojun
 * @Date: 2024-02-04 11:49:42
 * @LastEditors: xiaojun
 * @LastEditTime: 2024-02-07 16:16:13
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

const myVitePlugin = {
  name: 'vue3-inset-loader',
  transform(code, id) {
    if (!_init) {
      _init = true;
      init(this);
    }

    const route = getRoute(id);
    const curPage = pagesMap[route];
    
    if (id.endsWith('.vue') && needHandle && curPage) {
      const compiler = parse(code);
      const labelCode = generateLabelCode(curPage.label);
      let templateCode = compiler.descriptor && compiler.descriptor.template ? compiler.descriptor.template.content : '';
      templateCode = labelCode + templateCode;
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
