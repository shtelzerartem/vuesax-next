import { VNode } from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import VsComponent from '../../mixins/component'
import { insertBody, setCords } from '../../util/index'

@Component
export default class VsList extends VsComponent {
  // @Provide()
  // select: any = this

  @Prop({ type: Boolean, default: false }) filter: boolean

  @Prop({ type: Boolean, default: false }) loading!: boolean

  @Prop({ type: String, default: null }) state!: string

  @Prop({ type: Boolean, default: false }) block!: boolean

  renderSelect: boolean = false

  hoverOption: any = -1

  uids: any = []

  childOptions: any = []

  targetSelect: boolean = false

  targetSelectInput: boolean = false

  targetClose: boolean = false

  activeFilter: boolean = false

  textFilter: string = null

  childVisibles: number = 0

  isSelect: boolean = true

  insertOptions() {
    const options = this.$refs.options as HTMLElement
    insertBody(options, document.body)
    setCords(options, this.$refs.select)
  }

  handleKeydown(evt: any) {
    const options = this.$refs.options as HTMLElement
    for (let index = 0; index < 300; index++) {
      setTimeout(() => {
        setCords(options, this.$refs.select)
      }, index);
    }
    if (evt.code == 'ArrowDown') {
      evt.preventDefault()
      if (this.hoverOption < this.childOptions.length - 1) {
        this.hoverOption++
      } else {
        this.hoverOption = 0
      }
    } else if (evt.code == 'ArrowUp') {
      evt.preventDefault()
      if (this.hoverOption > 0) {
        this.hoverOption--
      } else {
        this.hoverOption = this.childOptions.length - 1
      }
    } 

    if (this.hoverOption !== -1) {
      (this.$refs.content as HTMLElement).scrollTop = this.childOptions[this.hoverOption].$el.offsetTop - 66
    }

  }

  get notData() {
    let childOptions: any[] = []

    this.$slots.default.forEach((option: any): any => {
      if (option.tag) {
        if (option.componentInstance && !option.componentInstance.hiddenOption) {
          childOptions.push(option)
        }
      }
    })

    childOptions = childOptions.filter((item) => {
      if (item.optionGroup) {
        return !item.componentInstance.hiddenOptionGroup
      }
      return true
    })
    
    return childOptions.length === 0
  }

  handleResize() {
    const options = this.$refs.options as HTMLElement
    if (!options) { return }
    this.$nextTick(() => {
      setCords(options, this.$refs.select)
    })

    for (let index = 0; index < 300; index++) {
      setTimeout(() => {
        setCords(options, this.$refs.select)
      }, index);
    }
  }

  handleScroll() {
    const options = this.$refs.options as HTMLElement
    if (options) {
      setCords(options, this.$refs.select)
    }
  }

  beforeEnter(el: any) {
    el.style.height = 0
  }

  enter(el: any, done: any) {
    let h = el.scrollHeight
    el.style.height = h - 1 + 'px'
    done()
  }

  leave(el: any, done: any) {
    el.style.minHeight = '0px'
    el.style.height = '0px'
  }

  getMessage(type: string) {
    return this.$createElement('transition', {
      on: {
        beforeEnter: this.beforeEnter,
        enter: this.enter,
        leave: this.leave
      },
    }, [
      !!this.$slots[`message-${type}`] && this.$createElement('div', {
        staticClass: 'vs-select__message',
        class: [`vs-select__message--${type}`]
      }, [
        this.$slots[`message-${type}`]
      ])
    ])
  }

  @Watch('textFilter')
  handleTextFilter(val: string) {
    if (val) {
      if (this.$refs.placeholder) {
        (this.$refs.placeholder as HTMLElement).style.transition = '0s'
      }
    } else {
      if (this.$refs.placeholder) {
        (this.$refs.placeholder as HTMLElement).style.transition = ''
      }
    }
  }


  mounted() {
    this.renderSelect = true

    window.addEventListener('resize', this.handleResize)
    window.addEventListener('scroll', this.handleScroll)
  }

  beforeDestroy() {
    this.handleBlur()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
  }

  public render(h: any): VNode {

    const options = h('div', {}, [ 
      h('div', {
        staticClass: 'vs-list__options',
        ref: 'options',
        style: {
          ['--vs-color']: this.color ? this.getColor : ''
        },
        class: [
          { isColorDark: this.isColorDark },

          // colors
          { [`vs-component--primary`] : !this.danger && !this.success && !this.warn && !this.dark && !this.color },
          { [`vs-component--danger`] : !!this.danger },
          { [`vs-component--warn`] : !!this.warn },
          { [`vs-component--success`] : !!this.success },
          { [`vs-component--dark`] : !!this.dark },
        ],
      }, 
      [ h('div', {
          staticClass: 'vs-select__options__content',
          ref: 'content'
        }, [
          this.notData && h('div', {
            staticClass: 'vs-select__options__content__not-data'
          }, [
            this.$slots.notData || 'No data available'
          ]),
          this.$slots.default
        ])
      ])
    ])

    const loading = h('div', {
      staticClass: 'vs-select__loading',
    })

    const messageSuccess = this.getMessage('success')

    const messageDanger = this.getMessage('danger')

    const messageWarn = this.getMessage('warn')

    const messagePrimary = this.getMessage('primary')

    const listContent = h('div', {
      staticClass: 'vs-list',
      ref: 'select',
      class: [
        `vs-select--state-${this.state}`,
        {
          'loading': this.loading
        }
      ],
    }, [
      options,
      this.loading && loading,
    ])

    return  h('div', {
      staticClass: 'vs-select-content',
      style: {
        ['--vs-color']: this.color ? this.getColor : ''
      },
      class: [{
        block: this.block
      },
      // colors
      { [`vs-component--primary`] : !this.danger && !this.success && !this.warn && !this.dark && !this.color },
      { [`vs-component--danger`] : !!this.danger },
      { [`vs-component--warn`] : !!this.warn },
      { [`vs-component--success`] : !!this.success },
      { [`vs-component--dark`] : !!this.dark },
    ]
    }, [
      listContent,
      messageSuccess,
      messageDanger,
      messageWarn,
      messagePrimary
    ])
  }
}
