import {mergeOptions} from '../util/index'
export default function initExtend(Vue){
    // 为什么要有子类和父类  new Vue  （Vue的构造函数）  ._init()
    // 创建子类  继承于父类 扩展的时候都扩展到自己的属性上
    let cid = 0
    Vue.extend = function (extendOptions) { //extendOptions是一个对象
        // 
        const Sub = function VueComponent(options){
            // 子类调用_init，会通过原型链找到Vue.prototype上的_init方法
            this._init(options)
        }
        Sub.cid = cid++;
        // 实现Sub类继承Vue类，Sub -> Sub.prototype -> Vue.prototype
        Sub.prototype = Object.create(this.prototype);
        Sub.prototype.constructor = Sub;

        // 继承父类的各种方法
        Sub.options = mergeOptions(
            this.options, // 父类的options
            extendOptions // 子类传入的对象
        )
        // mixin
        // use 
        // ...
        Sub.mixin = this.mixin;
        Sub.use = this.use; 
        return Sub;
    }
}