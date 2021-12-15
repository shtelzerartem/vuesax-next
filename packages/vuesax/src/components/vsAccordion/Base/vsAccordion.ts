import * as _ from 'lodash'
import { VNode } from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import VsComponent from '../../../mixins/component'

@Component
export default class VsAccordion extends VsComponent {
  hidden: boolean = true

  @Watch('hidden')
  handleChangeHidden(val: boolean) {
    if (!val) {
      this.$nextTick(() => {
        const body: any = this.$refs.body
        body.style.height = `${body.scrollHeight}px`
        setTimeout(() => {
          body.style.height = `auto`
        }, 350)
      })
    }
    else {      
      this.$nextTick(() => {
        const body: any = this.$refs.body
        body.style.height = `${body.scrollHeight}px`
        setTimeout(() => body.style.height = `0px`, 1)
      })
    }
  }

  public render(h: any): VNode {
    const header = h('div', { 
      staticClass: 'vs-accordion__header',
      on: {
        click: (evt: any) => (this.hidden = !this.hidden)
      },
    }, [ this.$slots.header ])

    const body = h('div', {
      staticClass: 'vs-accordion__body_wrapper',
      ref: 'body',
      style: {
        height: 0
      }
    }, [
      h('div', {
        staticClass: 'vs-accordion__body'
      }, [this.$slots.body])
    ])


    const accordion = h('div', {
      staticClass: 'vs-accordion',
      
    }, [ 
      header,
      h('transition', {
        props: {
          name: 'fade-expand'
        }
      }, [body])
    ])

    return h('div', {
      staticClass: 'vs-accordion-content',
    }, [accordion])
  }
}
