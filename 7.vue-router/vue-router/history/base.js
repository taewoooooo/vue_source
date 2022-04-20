export const createRoute = (record, location) => { // 根据匹配到的记录来计算匹配到的所有的记录  
    let matched = []
    if (record) {
        // 'about/a'要渲染两个组件About和A
        // 'about/a'找到的record是{path: '/about/a', component: 'A', parent: {path:'/about',component: 'About', parent:{...}}}
        //    将父记录的record都放到matchd数组中，
        while (record) {
            matched.unshift(record);
            record = record.parent; // 通过当前记录找到所有的父亲 
        }
    }
    return { // {path:'/',matched:[{}]}
        ...location,
        matched
    }
}



// 这个current就是一个普通的变量 this.current ?  希望current变化了可以更新视图
export default class History {
    constructor(router) {
        this.router = router;

        // 这个代表的是 当前路径匹配出来的记录
        // 路径'/'匹配出的记录为 {path:'/',component: Home}
        // 路径'/about/a'匹配出的记录有两个{path:'/about',component: About} {path:'/about/a',component: A}
        //    然后在App.vue中渲染About组件，在about.vue中渲染A组件
        this.current = createRoute(null, {
            path: '/'
        });
        // this.current = {path:'/',matched:[]}
    }
    transitionTo(location, complete) {
        // location是路径，用来匹配对应的记录
        // complete是监听路径变化

        // 获取当前路径匹配出对应的记录，当路径变化时获取对应的记录  =》 渲染页面 （router-view实现的）
        // 通过路径拿到对应的记录 有了记录之后 就可以找到对象的匹配
        let current = this.router.match(location); //this.router.matcher.match(location)

        // 防止重复点击 不需要再次渲染
        // 匹配到的个数和路径都是相同的 就不需要再次跳转了
        if (this.current.path == location && this.current.matched.length === current.matched.length) {
            return;
        }
        // 我们需要调用 钩子函数
        let queue = this.router.beforeHooks   // [f1, f2, f3]
        
        const iterator = (hook,next) => hook(current,this.current,next) // hook(to, from, next) 用户必须自己调用next()

        const runQueue = (queue,iterator,complete)=>{
          function next(index){
              if(index >= queue.length){
                  return complete(); // 当前所有的钩子函数都执行完了，beforeEach周期结束，执行complete更新渲染页面
              }
              let hook = queue[index];  // f1, f2, f3 是 hook
              iterator(hook,()=>next(index+1)); // 就是遍历的过程 
          }
          next(0);
        }

        runQueue(queue, iterator, () => {

            // 用最新的匹配到的结果 ， 去更新视图
            this.current = current; // 这个current只是响应式的 他的变化不会更新_route
            this.cb && this.cb(current);

            // 当路径变化后 current属性会进行更新操作
            complete && complete();
        })
    }
    listen(cb) { // 保存回调函数
        this.cb = cb;
    }
}

// Vue.component('名字',对象)  全局的
// .vue 文件 最终会变成一个对象


// 自己尝试画一个流程图 vue-router