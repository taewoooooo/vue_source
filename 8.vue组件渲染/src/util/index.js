
/**
 * 
 * @param {*} data  当前数据是不是对象
 */
export function isObject(data) {
    return typeof data === 'object' && data !== null;
}
export function def(data,key,value){
    Object.defineProperty(data,key,{
        enumerable:false,
        configurable:false,
        value
    })
}
// 取值时实现代理效果
export function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newValue){
            vm[source][key] = newValue; 
        }
    })
}
const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
];

let strats = {}

function mergeHook(parentVal,childVal){
    if(childVal){
        if(parentVal){
            return parentVal.concat(childVal);
        }else{
           return [childVal]; 
        }
    }else{
        return parentVal;
    }
}
LIFECYCLE_HOOKS.forEach(hook=>{
    strats[hook] = mergeHook
})

function mergeAssets(parentVal,childVal) {
    // 先找childVal里有没有对应的组件名,如果有就用childVal,即重名用实例自己的
    // 没有就顺着原型链'res -> parentVal'去parentVal上找组件名
    const res = Object.create(parentVal) // res.__proto__ = parentVal
    if(childVal){
        for(let key in childVal){
            res[key] = childVal[key];
        }
    }
    return res;
}

// 组件的合并策略
strats.components = mergeAssets

export function mergeOptions(parent,child){
    const options = {};
    for(let key in parent){
        mergeField(key);
    }
    for(let key in child){ //  如果已经合并过了就不需要再次合并了
        if(!parent.hasOwnProperty(key)){
            mergeField(key);
        }
    }
    // 默认的合并策略 但是有些属性 需要有特殊的合并方式 生命周期的合并
    function mergeField(key) {
        if(strats[key]) {
            return options[key] = strats[key](parent[key],child[key])
        }
        if(typeof parent[key] === 'object' && typeof child[key] === 'object'){
            options[key] = {
                ...parent[key],
                ...child[key]
            }
        }else if(child[key] == null){
            options[key] = parent[key];
        }else{
            options[key] = child[key];
        }   
    }
    return options;
}


export const isReservedTag = (tagName)=>{

    // 将所有原始标签存在str字符串中
    let str = 'p,div,span,input,button';
    let obj = {}
    str.split(',').forEach(tag=>{
        obj[tag] = true;
    });

    return obj[tagName];

}