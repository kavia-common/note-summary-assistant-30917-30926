import Blits from '@lightningjs/blits'
import NoteCard from './NoteCard.js'

export default Blits.Component('NotesList', {
  components: { NoteCard },
  props: ['items'],
  template: `
    <Element>
      <Element :for="(n, i) in $items" :key="$n.id" :x="$calcX($i)" :y="$calcY($i)">
        <NoteCard :note="$n" @select="$onSelect" @delete="$onDelete" />
      </Element>
      <!-- Empty state -->
      <Element :alpha="$showEmpty ? 1 : 0" x="120" y="280" w="800" h="240" :color="'#ffffff'" :effects="[$shader('radius', {radius: 12}), $shader('shadow', {color: '#0000001a', blur: 20})]">
        <Text x="40" y="60" size="40" color="#111827" content="No notes yet" />
        <Text x="40" y="120" size="28" color="#6B7280" content="Press the + button to create your first note." />
      </Element>
    </Element>
  `,
  computed: {
    showEmpty() {
      return !this.items || this.items.length === 0
    },
  },
  methods: {
    // PUBLIC_INTERFACE
    onSelect(note) {
      /** Bubble select up to parent. */
      this.$emit('select', note)
    },
    // PUBLIC_INTERFACE
    onDelete(note) {
      /** Bubble delete up to parent. */
      this.$emit('delete', note)
    },
    calcX(index) {
      return (index % 2) * 620
    },
    calcY(index) {
      return Math.floor(index / 2) * 240
    },
    // Template wrapper methods
    $onSelect(note) {
      this.onSelect(note)
    },
    $onDelete(note) {
      this.onDelete(note)
    },
    $calcX(i) {
      return this.calcX(i)
    },
    $calcY(i) {
      return this.calcY(i)
    },
  },
})
