import type { EditorImage } from '@/components/Editor/types/Editor'
import { atom } from 'nanostores'

export const $editorImages = atom<EditorImage[]>([])
export const $editorBackground = atom<string>('#ffffff')
export const $isDownloading = atom<boolean>(false)
