import Blits from '@lightningjs/blits'
import Header from '../components/Header.js'
import NotesList from '../components/NotesList.js'
import NoteEditor from '../components/NoteEditor.js'
import { subscribe, getState, addNote, updateNote, deleteNote, selectNote } from '../store.js'

export default Blits.Component('Home', {
  components: { Header, NotesList, NoteEditor },
  template: `
    <Element w="1920" h="1080" color="#f0f4ff">
      <Header />
      <!-- Main Body -->
      <Element x="80" y="140">
        <!-- Left: Notes list -->
        <Element x="0" y="0" w="1240" h="860">
          <NotesList :items="$notes" @select="handleSelectNote" @delete="handleDeleteNote" />
        </Element>
        <!-- Right: Editor / Viewer -->
        <Element x="1280" y="0" w="560" h="860">
          <Element :alpha="$mode === 'view' ? 1 : 0">
            <Element w="560" h="420" :color="'#ffffff'" :effects="[$shader('radius', {radius: 12}), $shader('shadow', {color: '#00000022', blur: 24})]">
              <Text x="24" y="20" size="32" color="#111827" :content="$currentTitle" maxwidth="512" />
              <Text x="24" y="72" size="24" color="#6B7280" :content="$currentDate" />
              <Text x="24" y="120" size="26" color="#111827" :content="$currentContent" maxwidth="512" lineheight="34" />
            </Element>
            <Element x="0" y="460" w="560" h="100">
              <Element w="260" h="60" color="#2563EB" :effects="[$shader('radius', {radius: 12})]" @enter="handleEdit">
                <Text x="24" y="12" size="30" color="#ffffff" content="Edit" />
              </Element>
              <Element x="300" w="260" h="60" color="#EF4444" :effects="[$shader('radius', {radius: 12})]" @enter="handleDeleteCurrent">
                <Text x="24" y="12" size="30" color="#ffffff" content="Delete" />
              </Element>
            </Element>
          </Element>

          <Element :alpha="$mode === 'edit' ? 1 : 0">
            <NoteEditor ref="editor" :value="$editorContent" :title="$editorTitle" @save="handleSave" />
          </Element>
        </Element>
      </Element>

      <!-- Floating Action Button -->
      <Element x="1720" y="920" w="120" h="120" color="#2563EB" :effects="[$shader('radius', {radius: 60}), $shader('shadow', {color: '#00000033', blur: 24})]" @enter="handleCreateNew">
        <Text x="43" y="34" size="56" color="#ffffff" content="+" />
      </Element>
    </Element>
  `,
  state() {
    const { notes, selectedId } = getState()
    return {
      notes,
      selectedId,
      mode: selectedId ? 'view' : 'edit',
      editorTitle: '',
      editorContent: '',
    }
  },
  computed: {
    current() {
      return this.notes.find((n) => n.id === this.selectedId) || null
    },
    currentTitle() {
      return this.current?.title || 'Untitled'
    },
    currentDate() {
      return this.current ? this.formatDate(this.current.createdAt) : ''
    },
    currentContent() {
      return this.current?.content || ''
    },
  },
  hooks: {
    ready() {
      this.unsub = subscribe((st) => {
        this.notes = st.notes
        this.selectedId = st.selectedId
        this.mode = this.selectedId ? 'view' : 'edit'
        if (this.mode === 'edit' && this.selectedId) {
          const n = this.notes.find((x) => x.id === this.selectedId)
          if (n) {
            this.editorTitle = n.title
            this.editorContent = n.content
          }
        }
      })
    },
    destroy() {
      if (this.unsub) this.unsub()
    },
  },
  methods: {
    formatDate(ts) {
      const d = new Date(ts || Date.now())
      return d.toLocaleString()
    },
    handleSelectNote(note) {
      if (note?.id) {
        selectNote(note.id)
      }
    },
    handleDeleteNote(note) {
      if (note?.id) {
        deleteNote(note.id)
      }
    },
    handleDeleteCurrent() {
      if (this.current?.id) {
        deleteNote(this.current.id)
      }
    },
    handleSave(payload) {
      if (this.mode === 'edit' && this.current?.id) {
        updateNote(this.current.id, payload)
        this.mode = 'view'
      } else {
        const id = addNote(payload)
        selectNote(id)
        this.mode = 'view'
      }
    },
    handleCreateNew() {
      this.editorTitle = ''
      this.editorContent = ''
      selectNote(null)
      this.mode = 'edit'
    },
    handleEdit() {
      if (this.current) {
        this.editorTitle = this.current.title
        this.editorContent = this.current.content
        this.mode = 'edit'
      }
    },
  },
})
