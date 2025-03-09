import type { EditorImage } from '@/components/Editor/types/Editor'
import { atom } from 'nanostores'

export const $editorImages = atom<EditorImage[]>([])
