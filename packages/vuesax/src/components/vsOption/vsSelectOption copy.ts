import { VNode } from 'vue'
import { Component, Inject, Prop, Watch  } from 'vue-property-decorator'
import VsComponent from '../../mixins/component'
import '../vsCheckbox/Base/style.sass'
import vsCheckbox from '../vsCheckbox/Base/vsCheckbox'

@Component
export default class VsSelectOption extends VsComponent {
  @Prop({}) value!: any

  @Prop({type: Boolean, default: false}) disabled: boolean

  // @Inject()
  // select: any

  @Prop({}) label!: any

  activeOption: boolean = false

  hiddenOption: boolean = false

  _uid: any

  myIndex: 0

  @Watch('$parent.textFilter')
  handleTextFilter(val: string) {
    this.hiddenOption = val 
      ? this.label.toLowerCase().indexOf(val.toLowerCase()) === -1 ? true : false 
      : false
  }

  get isActive() {
    const parentValue = this.getParent().value;
    if (parentValue) {
      if (typeof parentValue === 'string') return parentValue === this.value;
      if (typeof parentValue === 'number') return parentValue == this.value;
  
      return parentValue.indexOf(this.value) !== -1;
    }

    return false
  }

  get isHover() {
    return (this.getParent().isSelect) 
      ? this.getParent().uids.indexOf(this._uid) == this.getParent().hoverOption
      : false
  }

  get isMultiple() {
    return this.getParent().multiple ? this.getParent().multiple : false
  }

  getParent() {
    return (this.$parent as any) || (this.$parent.$parent as any)
  }

  mounted() {
    if (this.getParent().isSelect) {
      if (!this.getParent().renderSelect) {
        this.getParent().childOptions.push(this)
      }
      this.getParent().uids.push(this._uid)
      this.getParent().setHover()
    }

    this.activeOption = this.isActive
  }

  public render(h: any): VNode {
    const checkbox = h(vsCheckbox, {
      props: {
        checkedForce: this.isActive,
      },
    }, [this.$slots.default])

    return h('button', {
      attrs: {
        disabled: this.disabled
      },
      staticClass: 'vs-select__option',
      class: [{
        activeOption: this.isActive,
        isHover: this.isHover,
        isMultiple: this.isMultiple,
        hiddenOption: this.hiddenOption
      }],
      on: {
        ...this.$listeners,
        mousedown: () => (this.$parent as any).clickOption(this.value, this.label),
        blur: () => {
          if (!(this.$parent as any).targetSelect && !(this.$parent as any).targetClose) {
            (this.$parent as any).activeOptions = false
          }
        }
      }
    }, [
      this.isMultiple && checkbox,
      !this.isMultiple && this.$slots.default,
    ])
  }
}
