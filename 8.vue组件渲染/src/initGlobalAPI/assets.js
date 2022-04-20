import {ASSETS_TYPE} from './const'

export default function initAssetRegisters(Vue){
    ASSETS_TYPE.forEach(type=>{ // 
        /*
        Vue.component('my-component', {
            template: '<div>hello 你好</div>',
        });
        其中'my-component'是id，后面的对象是definition
        需要把definition对象用extend方法变成构造函数
        并将构造函数放在Vue.options.my-component中
        */
        
        Vue[type] = function (id,definition) {
            if(type === 'component'){
                // 注册全局组件
                // 使用extend 方法 将对象变成构造函数
                // 子组件也能调用component方法，此时this指向子组件，用this.options._base指向Vue构造函数
                ; //或this.options._base.extend();
            }else if(type === 'filter'){


            }else if(type === 'directive'){


            }
            // 为什么要将这三个放在Vue.options对象中而不是直接放在Vue上呢？
            // 因为Vue.options里是需要传给子类的，Vue上的不需要传给子类
            this.options[type+'s'][id] = definition
        }
    })
}