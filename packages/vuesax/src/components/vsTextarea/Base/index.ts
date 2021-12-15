import './style.sass'
import component from './VsTextarea'

component.install = (vue: any) => {
  vue.component('vs-textarea', component)
}

if (typeof window !== 'undefined' && window.Vue) {
  component.install(window.Vue)
}

export default component
