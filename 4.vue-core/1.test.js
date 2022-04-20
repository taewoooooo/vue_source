let compiler = require('vue-template-compiler');


let t = ` <div v-for="(a,index) of arr" :key="index" v-if="a%2 === 0">
{{a}}
</div>`

//  vue-loader -> vue-template-compiler
console.log(compiler.compile(t).render)


// let t = `<div v-if="true">hello</div>
//  <div v-else>world</div> `
// with(this){return (true)?_c('div',[_v("hello")]):_c('div',[_v(" world")])}

/*
let t = ` <div v-show="false">hello</div>`
with(this){return _c('div',{directives:[{name:"show",rawName:"v-show",value:(false),expression:"false"}]},[_v("hello")])}
*/


/*
  let t = ` <div v-for="(a,index) of arr" :key="index" v-if="a%2 === 0">{{a}}</div>`
  with(this){return _l((arr),function(a,index){return (a%2 === 0)?_c('div',{key:index},[_v("\n"+_s(a)+"\n")]):_e()})}
*/