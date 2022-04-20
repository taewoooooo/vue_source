
const loadImageAsync = (src, resolve, reject) => {
  let img = new Image();
  img.src = src;
  img.onload = resolve;
  img.onerror = reject;
}

// 获取带有overflow滚动属性的最近父元素
const getScrollParent = el => {
  let parent = el.parentNode;
  while (parent) {
    if (/(scroll)|(auto)/.test(getComputedStyle(parent)['overflow'])) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return parent; // 如果没有，就返回最外层的元素
}


const Lazy = (Vue) => {

  // class A B C都可以拿到同一个Vue，柯里化
  class ReactiveListener { //将每张图片都封装为类，方便拓展
    constructor({ el, src, options, elRender }) {
      this.el = el;
      this.src = src;
      this.options = options;
      this.state = { loading: false }; // 当前图片是否加载过
      this.elRender = elRender;
    }
    checkInView() {
      let { top } = this.el.getBoundingClientRect();
      return top < window.innerHeight * (this.options.preLoad || 1.3);
    }
    load() {
      // 一开始默认都是loading状态
      this.elRender(this, 'loading');
      loadImageAsync(this.src, () => {
        this.state.loading = true;
        this.elRender(this, 'finish');
      }, () => {
        this.elRender(this, 'error');
      })
    }
  }

  return class LazyClass {
    constructor(options) {
      this.options = options;
      this.bindHandle = false; // 防止多次绑定的标志
      this.listenerQueue = []; // 用来存放图片的类
      //  
    }
    // 判断数组中的图片哪些需要加载
    handleLazyLoad() {
      // 计算当前图片的位置
      this.listenerQueue.forEach(listener => {
        // 如果当前图片没加载，就用下面方式加载
        if (!listener.state.loading) {
          let catIn = listener.checkInView(); //判断当前图片是否在渲染范围内
          catIn && listener.load(); // 如果在渲染范围内就将其加载
        }
      })
    }
    // 走了11遍,因为有11张带v-lazy的图
    add(el, bindings, vnode) {
      Vue.nextTick(() => {
        debugger;
        let scrollParent = getScrollParent(el); // 获取带有滚动属性的父元素
        if (scrollParent && !this.bindHandle) {
          scrollParent.addEventListener('scroll', this.handleLazyLoad.bind(this));
          this.bindHandle = true;
        }
        const listener = new ReactiveListener({
          el,
          src: bindings.value,
          options: this.options,
          elRender: this.elRender.bind(this)
        });
        this.listenerQueue.push(listener); // 将每个图片都创建成实例存到队列中
        this.handleLazyLoad();

      })
    }

    // 根据状态state渲染不同的图片，
    elRender(listener, state) {
      let el = listener.el;
      let src = '';
      switch (state) {
        case 'loading':
          src = listener.options.loading || '';
          break;
        case 'error':
          src = listener.options.error || '';
          break;
        default:
          src = listener.src;
          break;
      }
      el.setAttribute('src', src);
    }
  }
}

const VueLazyload = {
  install(Vue, options) {

    // 把所有逻辑封装到lazyClass类中，将这个类放到函数中，实现函数柯里化
    const LazyClass = Lazy(Vue);
    const lazy = new LazyClass(options);

    Vue.directive('lazy', {
      // bind有三个参数 el, bindings, vnode
      // el是设置了v-lazy属性的DOM元素
      // bindings有value和expression，表示v-lazy="xx"中xx的真实值和xx本身这个字符串
      // vnode是有v-lazy属性的标签对应的虚拟节点
      // 必须绑定this，不然指向window，【例】obj = {a:function(){}}, b = obj.a, b() this为window
      // bind阶段不能访问父元素，因为这时还没有将这个元素插入页面
      // inserted阶段可以访问父元素，此时已经插入父元素下面了
      bind: lazy.add.bind(lazy)  // 一共有11张带v-lazy的图片标签,则一共走11遍这个add方法
    })
  }
}