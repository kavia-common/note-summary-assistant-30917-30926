import Blits from '@lightningjs/blits'

export default Blits.Component('NoteEditor', {
  props: ['value', 'title'],
  template: `
    <Element w="560" h="860">
      <!-- Surface ---->
      <Element x="0" y="0" w="560" h="560" color="#ffffff" :effects="[$shader('radius', {radius: 12}), $shader('shadow', {color: '#00000022', blur: 24})]">
        <Text x="24" y="22" size="26" color="#6B7280" :content="$titleLabel" />
        <!-- Content text (multi-line). Using plain Text with manual editing via input events. -->
        <Text ref="content" x="24" y="64" size="28" color="#111827" :content="$displayValue" maxwidth="510" lineheight="36" />
      </Element>

      <!-- Save button -->
      <Element x="0" y="600" w="200" h="60" color="#2563EB" :effects="[$shader('radius', {radius: 12})]" @enter="$save">
        <Text x="24" y="12" size="30" color="#ffffff" content="Save" />
      </Element>
    </Element>
  `,
  state() {
    return {
      internal: this.value || '',
      titleInternal: this.title || '',
    }
  },
  computed: {
    displayValue() {
      // Render placeholder for empty state
      return this.internal && this.internal.length
        ? this.internal
        : '[ Type your note here... ]'
    },
    titleLabel() {
      return `Title: ${this.titleInternal || 'Untitled'}`
    },
  },
  watch: {
    value(newVal) {
      this.internal = newVal || ''
    },
    title(newVal) {
      this.titleInternal = newVal || ''
    },
  },
  methods: {
    // PUBLIC_INTERFACE
    setValue(text) {
      /** Set the editor content programmatically. */
      this.internal = text || ''
    },
    // PUBLIC_INTERFACE
    setTitle(text) {
      /** Set the editor title programmatically. */
      this.titleInternal = text || ''
    },
    // PUBLIC_INTERFACE
    getValue() {
      /** Returns current editor content. */
      return this.internal
    },
    // PUBLIC_INTERFACE
    getTitle() {
      /** Returns current editor title. */
      return this.titleInternal
    },
    // PUBLIC_INTERFACE
    save() {
      /** Emits save with title and content values. */
      this.$emit('save', { title: this.titleInternal, content: this.internal })
    },
    /** Private wrapper to keep @enter clean in template */
    $save() {
      this.save()
    },
  },
  input: {
    up() {
      // ignored in text entry
    },
    down() {
      // ignored in text entry
    },
    left() {
      // ignored in text entry
    },
    right() {
      // ignored in text entry
    },
    enter() {
      // default enter bound to Save via @enter
    },
    back() {
      // treat back as minor deletion
      if (this.internal.length) {
        this.internal = this.internal.slice(0, -1)
      }
    },
    // Capture character input
    char(e) {
      // In Blits, printable characters can be read from e.key if present
      const ch = e && (e.char || e.key || '')
      if (!ch) return
      // crude handling for newline
      if (ch === '\n') {
        this.internal += '\n'
      } else {
        this.internal += ch
      }
    },
  },
})
