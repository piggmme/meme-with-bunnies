import { editorSize } from '@/constants/editor'

const maxSize = editorSize / 2
const minSize = editorSize / 4

export const getImageSize = (image: { width: number, height: number }) => {
  const ratio = image.width / image.height
  const width = Math.min(maxSize, Math.max(minSize, image.width))
  const height = width / ratio

  console.log(image, minSize, width, height)

  return { width, height }
}
