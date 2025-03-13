import type { CanvasImage } from '@/types/canvas'
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
export const $canvasImages = atom<CanvasImage[]>([])
export const $canvasBackground = atom<string>('#ffffff')
export const $isDownloading = atom<boolean>(false)
export const $canvasSelectedId = atom<string | null>(null)

export function useSelectImage () {
  const canvasSelectedId = useStore($canvasSelectedId)

  const selectImage = (id: string) => {
    $canvasSelectedId.set(id)
  }

  const deselectImage = () => {
    $canvasSelectedId.set(null)
  }

  return {
    selectedId: canvasSelectedId,
    selectImage,
    deselectImage,
  }
}

export function resetCanvasState () {
  $canvasImages.set([])
  $canvasBackground.set('#ffffff')
  $canvasSelectedId.set(null)
}
