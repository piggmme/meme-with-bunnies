import type { EditorImage } from '@/components/Editor/types/Editor'
import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'

interface CanvasSize {
  width: number
  height: number
}

export const $canvasSize = atom<CanvasSize>({
  width: Math.min(window.innerWidth - 20, 500),
  height: Math.min(window.innerWidth - 20, 500),
})
export const $editorImages = atom<EditorImage[]>([])
export const $editorBackground = atom<string>('#ffffff')
export const $isDownloading = atom<boolean>(false)
export const $editorSelectedId = atom<string | null>(null)

export function useSelectImage () {
  const editorSelectedId = useStore($editorSelectedId)

  const selectImage = (id: string) => {
    $editorSelectedId.set(id)
  }

  const deselectImage = () => {
    $editorSelectedId.set(null)
  }

  return {
    selectedId: editorSelectedId,
    selectImage,
    deselectImage,
  }
}
