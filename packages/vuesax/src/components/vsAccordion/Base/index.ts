import './style.sass'
import component from './vsAccordion'

component.install = (vue: any) => {
  vue.component('vs-accordion', component)
}

if (typeof window !== 'undefined' && window.Vue) {
  component.install(window.Vue)
}

export default component
