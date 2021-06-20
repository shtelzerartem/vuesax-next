import { VNode } from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import VsComponent from '../../../mixins/component'

@Component
export default class VsNavbarGroup extends VsComponent {
  @Prop({ default: false, type: Boolean }) active: boolean
  @Prop({}) id: string

  @Watch('active')
  handleWatchActive() {
    this.handleLine()
  }

  handleLine() {
    this.$nextTick(() => {
      if (this.active) this.setLeftLine();
    })
  }

  setModel(id: any) {
    const parent: any = this.$parent
    parent.setModel(id)
  }
  
  setLeftLine() {
    const parent: any = this.$parent
    const left = (this.$el as any).offsetLeft
    parent.setLeftLine(left)
    const width = (this.$refs.item as any).scrollWidth
    parent.setWidthLine(width)
  }
  setWidthLine() {}

  handleClick() {
    this.setModel(this.id);
    this.handleLine()
  }
  
  public render(h: any): VNode {
    const item = h('button', {
      staticClass: 'vs-navbar__group__item',
      ref: 'item',
      on: {
        click: (evt: any) => {
          this.$emit('click', evt)
          this.handleClick()
        }
      }
    }, [
      this.$slots.default
    ])
    const items = h('div', {
      staticClass: 'vs-navbar__group__items'
    }, [
      this.$slots.items
    ])

    return h('div', {
      staticClass: 'vs-navbar__group',
    }, [
      item,
      items
    ])
  }
}
