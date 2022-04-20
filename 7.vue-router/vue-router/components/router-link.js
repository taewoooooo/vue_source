export default {
    //  this指代的是当前组件  (插槽 分为具名插槽 )
    name:'router-link',
    functional:true,
    props:{
      to:{
        type:String,
        required:true
      },
      tag:{
        type:String
      }
    },
    render(h,context){
      let tag = context.tag || 'a';
      const clickHandler = ()=>{ // 指定跳转方法
          context.parent.$router.push(context.props.to);
          // 调用$router中的push方法进行跳转
      }
        return h(tag,{
          on: {
            click: clickHandler
          },
          // context指向当前的组件，相当于this，
          // router-link在放入Vue.options.components中时，已经使用Vue.extend创建构造函数
          // 在_render的createElement函数中new这个构造函数，生成组件实例
          // <slot name="default"></slot> 不写name默认是default，通过$slots.default获取插槽内容
        },context.slots().default);
    }
}

