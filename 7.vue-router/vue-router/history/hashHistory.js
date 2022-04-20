import History from './base';

const ensureSlash = () => {
    // window.location.href.split('#')[1]
    if(window.location.hash){
        return;
    }
    window.location.hash = '/';
}

export default class HashHistory extends History{
    constructor(router){
        super(router);
        this.router = router;
        // 如果使用hashHistory 默认如果没有hash 应该跳转到 首页 #/
        ensureSlash();
    }
    getCurrentLocation(){
        return window.location.hash.slice(1);  
    }
    setupListener(){
        window.addEventListener('hashchange',()=>{
            // 一旦hash路径变化，就会触发transitionTo方法对新的路径匹配对应记录，用于router-view渲染
            this.transitionTo(this.getCurrentLocation())
        })
    }
}