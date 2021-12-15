import './style.sass'
import component from './vsList'

component.install = (vue: any) => {
  vue.component('vs-list', component)
}

if (typeof window !== 'undefined' && window.Vue) {
  component.install(window.Vue)
}

export default component
