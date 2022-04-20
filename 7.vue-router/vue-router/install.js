export let Vue;
import RouterLink from './components/router-link';
import RouterView from './components/router-view';
const install = function (_Vue) {

    // install 方法内部一般会用他来定义一些全局的内容 指令、全局组件、给原型扩展方法
    Vue = _Vue;

    // 在全局注册这两个组件,用于在所有组件中直接使用
    Vue.component('router-link', RouterLink); 
    Vue.component('router-view', RouterView);

    // 用户将router放到了new Vue()中，希望每个子组件都可以拿到这个router属性
    //    子组件包括：App router-link router-view
    Vue.mixin({
        beforeCreate() { 
            // mixin 可以给beforeCreate 这个生命周期增加合并的方法（数组保存所有这个生命周期里的操作）
            // 如果有router 说明你在根实例上增加了router 当前这个实例是根实例
            // 渲染流程先父后子，渲染完毕 是先子后父 
            if (this.$options.router) {
                // 根实例
                this._routerRoot = this; // 就是将当前根实例放到了vm._routerRoot = vm
                this._router = this.$options.router; // 这是给根增加vm._router = router
                // 当前用户的router属性
                this._router.init(this); // 调用插件中的init方法

                // 如果用户更改了 current 是没有效果的 需要把_route也进行更新
                Vue.util.defineReactive(this, '_route', this._router.history.current);


            } else {
                // 儿子、孙子 。。。。
                this._routerRoot = this.$parent && this.$parent._routerRoot;
            }
            // 这里所有的组件都拥有了 this._routerRoot属性
            // this._routerRoot是根
        }
    });

    Object.defineProperty(Vue.prototype, '$route', { // 存放的都是属性 path，matched
        get() {
            return this._routerRoot && this._routerRoot._route; // 取current
        }
    })
    Object.defineProperty(Vue.prototype, '$router', { // 存放的都是属性 path，matched
        get() {
            return this._routerRoot && this._routerRoot._router; // 取current
        }
    })


    
}

export default install;