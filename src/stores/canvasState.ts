import type { CanvasImage } from '@/types/canvas'
import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'

interface CanvasSize {
  width: number
  height: number
}

const CANVAS_PADDING = 0
export const CANVAS_SIZE = 500
const CANVAS_RATIO = Math.min(window.innerWidth, CANVAS_SIZE) / CANVAS_SIZE

export const $canvasPosition = atom<{ x: number, y: number }>({ x: 0, y: 0 })
export const $canvasClientSize = atom<{ width: number, height: number }>({ width: 0, height: 0 })
export const $canvasSize = atom<CanvasSize>({
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
})
export const $canvasRatio = atom<number>(CANVAS_RATIO)
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

export function updateCanvasRatio (size: number) {
  $canvasRatio.set(Math.min(size, CANVAS_SIZE) / CANVAS_SIZE)
}

export function resetCanvasRatio () {
  $canvasRatio.set(CANVAS_RATIO)
}

export function resetCanvasState () {
  $canvasImages.set([])
  $canvasBackground.set('#ffffff')
  $canvasSelectedId.set(null)
  $canvasRatio.set(CANVAS_RATIO)
}
