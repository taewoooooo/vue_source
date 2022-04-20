import {mergeOptions} from '../util/index'
import initMixin from './mixin';
import initAssetRegisters from './assets.js'
import initExtend  from './extend'
import {ASSETS_TYPE} from './const'
export function initGlobalAPI(Vue){
    // 整合了所有的全局相关的内容，里面有components filters directives _base等属性
    Vue.options = {}

    // 定义Vue.mixin()
    initMixin(Vue)
   

    // 初始化的全局过滤器 指令  组件

    ASSETS_TYPE.forEach(type=>{
        Vue.options[type+'s'] = {}
    });
    Vue.options._base = Vue; // _base 是Vue的构造函数

    // 注册extend方法
    initExtend(Vue)
    // 将用户传入Vue.component()的参数作为键值对放入Vue.options.components中
    initAssetRegisters(Vue)
}
