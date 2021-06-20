import { VNode } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import VsComponent from '../../../mixins/component'

@Component
export default class VsDropdown extends VsComponent {

  @Prop({ default: false, type: Boolean }) loading: boolean

  activeOptions: boolean = false

  targetSelect: boolean = false

  targetSelectInput: boolean = false

  targetClose: boolean = false

  get notData() {
    let childOptions: any[] = []

    this.$slots.default.forEach((option: any): any => {
      if (option.tag && !option.componentInstance.hiddenOption) {
          childOptions.push(option)
      }
    })

    childOptions = childOptions.filter((item) => item.optionGroup ? !item.componentInstance.hiddenOptionGroup : true);
    
    return childOptions.length == 0
  }



  public render(h: any): VNode {
    const options = h('transition', {
      props: {
        name: 'vs-dropdown'
      },
    }, [ this.activeOptions && h('div', {
      staticClass: 'vs-dropdown__options',
      ref: 'options',
      style: {
        ['--vs-color']: this.color ? this.getColor : ''
      },
      class: [{
        isColorDark: this.isColorDark
      },
      // colors
      { [`vs-component--primary`] : !this.danger && !this.success && !this.warn && !this.dark && !this.color },
      { [`vs-component--danger`] : !!this.danger },
      { [`vs-component--warn`] : !!this.warn },
      { [`vs-component--success`] : !!this.success },
      { [`vs-component--dark`] : !!this.dark },
    ],
      on: {
        mouseleave: () => {
          this.targetSelect = false
          this.targetSelectInput = false
        },
        mouseenter: () => {
          this.targetSelect = true
          this.targetSelectInput = true
        }
      }
    }, [
        h('div', {
          staticClass: 'vs-dropdown__options__content',
          ref: 'content'
        }, [
          this.notData && h('div', {
            staticClass: 'vs-dropdown__options__content__not-data'
          }, [
            this.$slots.notData || 'No data available'
          ]),
          this.$slots.default
        ])
      ])
    ])


    const dropdown = h('div', {
      staticClass: 'vs-dropdown'
    }, [
      this.$slots.default
    ])

    return h('button', {
      staticClass: 'vs-dropdown-content',
    }, [
      dropdown
    ])
  }
}