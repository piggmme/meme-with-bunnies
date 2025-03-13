import { $canvasSize } from '@/stores/canvasState'

export const getImageSize = (image: { width: number, height: number }) => {
  const canvasWidth = $canvasSize.get().width
  const maxSize = canvasWidth / 2
  const minSize = canvasWidth / 4

  const ratio = image.width / image.height
  const width = Math.min(maxSize, Math.max(minSize, image.width))
  const height = width / ratio

  return { width, height }
}
