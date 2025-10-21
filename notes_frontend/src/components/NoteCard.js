import Blits from '@lightningjs/blits'

export default Blits.Component('NoteCard', {
  props: ['note'],
  template: `
    <Element w="560" h="220" :color="'#ffffff'" :effects="[$shader('radius', {radius: 12}), $shader('shadow', {color: '#00000022', blur: 24, spread: 2})]" @enter="handleClick">
      <!-- Title -->
      <Text x="24" y="20" size="36" color="#111827" :content="$note.title" maxwidth="512" />
      <!-- Summary -->
      <Text x="24" y="80" size="26" color="#374151" :content="$noteSummary" maxwidth="512" lineheight="32" />
      <!-- Date -->
      <Text x="24" y="170" size="22" color="#6B7280" :content="$noteDate" />
      <!-- Delete -->
      <Element x="480" y="160" w="56" h="40" color="#EF4444" :effects="[$shader('radius', {radius: 8})]" @enter="handleDelete">
        <Text x="12" y="4" size="24" color="#ffffff" content="Del" />
      </Element>
    </Element>
  `,
  computed: {
    noteSummary() {
      return this.note?.summary || 'No summary available.'
    },
    noteDate() {
      return this.formatDate(this.note?.createdAt)
    },
  },
  methods: {
    handleClick() {
      this.$emit('select', this.note)
    },
    handleDelete() {
      this.$emit('delete', this.note)
    },
    formatDate(ts) {
      const d = new Date(ts || Date.now())
      return d.toLocaleString()
    },
  },
  input: {
    enter() {
      this.handleClick()
    },
  },
})
