// Lapisan data prototype: semua state disimpan di localStorage.
// Struktur "entry" dibuat rapi supaya gampang diganti backend asli nanti —
// tinggal ganti fungsi read/write di file ini, komponen tidak perlu berubah.
import { getDummyPartnerAnswer } from '../data/dummyPartner'
import { WEEKLY_QUESTIONS } from '../data/weeklyQuestions'

const STORAGE_KEY = 'obrolin_kotak_waktu_state_v1'

const DEFAULT_STATE = {
  entries: {}, // key: entryId -> Entry
  currentWeek: 1, // dipakai oleh Kotak Waktu, digerakkan panel MODE DEMO
}

/**
 * Entry = { id, type: 'topik' | 'kotak-waktu', refId,
 *   myAnswer, mySubmittedAt, partnerAnswer, partnerSubmittedAt, openedAt }
 */

export function topikEntryId(topicId) {
  return `topik-${topicId}`
}

export function mingguEntryId(week) {
  return `minggu-${week}`
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    const parsed = JSON.parse(raw)
    return { ...structuredClone(DEFAULT_STATE), ...parsed }
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getEntry(entryId) {
  const state = loadState()
  return state.entries[entryId] ?? null
}

function ensureEntry(state, entryId, type, refId) {
  if (!state.entries[entryId]) {
    state.entries[entryId] = {
      id: entryId,
      type,
      refId,
      myAnswer: null,
      mySubmittedAt: null,
      partnerAnswer: null,
      partnerSubmittedAt: null,
      openedAt: null,
    }
  }
  return state.entries[entryId]
}

export function submitMyAnswer(entryId, type, refId, text) {
  const state = loadState()
  const entry = ensureEntry(state, entryId, type, refId)
  entry.myAnswer = text
  entry.mySubmittedAt = Date.now()
  saveState(state)
  return entry
}

// Simulasi tombol "Pasangan sudah menjawab" di panel demo.
export function simulatePartnerSubmit(entryId, type, refId) {
  const state = loadState()
  const entry = ensureEntry(state, entryId, type, refId)
  entry.partnerAnswer = getDummyPartnerAnswer(entryId)
  entry.partnerSubmittedAt = Date.now()
  saveState(state)
  return entry
}

export function markOpened(entryId) {
  const state = loadState()
  const entry = state.entries[entryId]
  if (entry) {
    entry.openedAt = Date.now()
    saveState(state)
  }
  return entry
}

export function getCurrentWeek() {
  return loadState().currentWeek
}

// Panel demo: "Lompat ke minggu berikutnya"
export function advanceWeek() {
  const state = loadState()
  state.currentWeek = Math.min(state.currentWeek + 1, WEEKLY_QUESTIONS.length)
  saveState(state)
  return state.currentWeek
}

export function resetAllDemoData() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Derive status baca-manusia dari sebuah entry.
 * type 'topik': belum-dibahas | menunggu-pasangan | siap-dibuka | sudah-dibuka
 * type 'kotak-waktu': tambahan status 'dilewati' kalau minggu sudah lewat
 * tapi belum lengkap dijawab berdua.
 */
export function getEntryStatus(entry, { isPastWeek = false } = {}) {
  if (!entry || !entry.myAnswer) {
    return isPastWeek ? 'dilewati' : 'belum-dibahas'
  }
  if (entry.openedAt) return 'sudah-dibuka'
  if (entry.myAnswer && entry.partnerAnswer) return 'siap-dibuka'
  if (isPastWeek) return 'dilewati'
  return 'menunggu-pasangan'
}
