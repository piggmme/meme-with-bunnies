import type { EditorImage } from '@/components/Editor/types/Editor'
import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'

interface CanvasSize {
  width: number
  height: number
}

// 왼쪽 하단 꼭지점의 위치
const CANVAS_PADDING = 0
export const $canvasPosition = atom<{ x: number, y: number }>({ x: 0, y: 0 })
export const $canvasClientSize = atom<{ width: number, height: number }>({ width: 0, height: 0 })
export const $canvasSize = atom<CanvasSize>({
  width: Math.min(window.innerWidth - CANVAS_PADDING, 500),
  height: Math.min(window.innerWidth - CANVAS_PADDING, 500),
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

export function resetEditorState () {
  $editorImages.set([])
  $editorBackground.set('#ffffff')
  $editorSelectedId.set(null)
}
