import './style.sass'
import component from './VsDropdown'

component.install = (vue: any) => {
  vue.component('vs-dropdown', component)
}

if (typeof window !== 'undefined' && window.Vue) {
  component.install(window.Vue)
}

export default component
