const STORAGE_KEY = 'notes_app_items_v1'

/**
 * Returns a short summary from text: first sentence or first 120 chars.
 * Trims whitespace and ensures no mid-word truncation when possible.
 */
// PUBLIC_INTERFACE
export function summarize(text) {
  /** This generates a short summary from the provided text using a simple heuristic. */
  if (!text) return ''
  const firstSentenceMatch = text.match(/[^.!?\\n]+[.!?]/)
  if (firstSentenceMatch) {
    return firstSentenceMatch[0].trim()
  }
  let snippet = text.slice(0, 120)
  if (text.length > 120) {
    // Avoid cutting off mid-word
    const lastSpace = snippet.lastIndexOf(' ')
    if (lastSpace > 60) snippet = snippet.slice(0, lastSpace)
    snippet = snippet.trim() + '…'
  }
  return snippet.trim()
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function save(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // ignore
  }
}

const listeners = new Set()

const state = {
  notes: load(),
  selectedId: null, // currently viewed note id or null for editor/new
}

// PUBLIC_INTERFACE
export function subscribe(fn) {
  /** Subscribe to store updates. Returns an unsubscribe function. */
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function notify() {
  listeners.forEach((fn) => fn(getState()))
}

// PUBLIC_INTERFACE
export function getState() {
  /** Returns a shallow copy of the current store state. */
  return { ...state, notes: [...state.notes] }
}

function createId() {
  return 'n_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// PUBLIC_INTERFACE
export function addNote({ title, content }) {
  /** Add a new note with auto-generated summary and persist it. */
  const id = createId()
  const createdAt = Date.now()
  const note = {
    id,
    title: (title || '').trim() || 'Untitled',
    content: content || '',
    summary: summarize(content || ''),
    createdAt,
  }
  state.notes.unshift(note)
  state.selectedId = id
  save(state.notes)
  notify()
  return id
}

// PUBLIC_INTERFACE
export function updateNote(id, { title, content }) {
  /** Update an existing note and refresh its summary. */
  const i = state.notes.findIndex((n) => n.id === id)
  if (i === -1) return
  const prev = state.notes[i]
  const next = {
    ...prev,
    title: (title ?? prev.title) || 'Untitled',
    content: content ?? prev.content,
    summary: summarize(content ?? prev.content),
  }
  state.notes.splice(i, 1, next)
  save(state.notes)
  notify()
}

// PUBLIC_INTERFACE
export function deleteNote(id) {
  /** Delete a note by id and persist change. */
  const i = state.notes.findIndex((n) => n.id === id)
  if (i === -1) return
  state.notes.splice(i, 1)
  if (state.selectedId === id) state.selectedId = null
  save(state.notes)
  notify()
}

// PUBLIC_INTERFACE
export function selectNote(id) {
  /** Select a note to view or edit. Use null to deselect to the editor. */
  state.selectedId = id
  notify()
}
