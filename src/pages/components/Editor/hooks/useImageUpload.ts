import { useEffect, useState } from 'react'
import 'gifler'

export function useImageUpload () {
  const [src, setSrc] = useState<string>('')
  const [imageElement, setImageElement] = useState<HTMLImageElement | HTMLCanvasElement | null>(null)
  const [size, setSize] = useState({ width: 500, height: 500 })
  const [isGif, setIsGif] = useState(false)

  const handleImageUpload = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      setIsGif(file.type === 'image/gif')
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setSrc(result)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (src) {
      if (isGif) {
        // GIF 처리
        const canvas = document.createElement('canvas')
        window.gifler(src).animate(canvas)
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        setImageElement(canvas)

        // GIF 크기 가져오기
        const img = new window.Image()
        img.src = src
        img.onload = () => {
          setSize({ width: img.width / 2, height: img.height / 2 })
        }
      } else {
        // 일반 이미지 처리
        const img = new window.Image()
        img.src = src
        img.onload = () => {
          setImageElement(img)
          setSize({ width: img.width / 2, height: img.height / 2 })
        }
      }
    }
  }, [src, isGif])

  const reset = () => {
    setSrc('')
    setImageElement(null)
    setSize({ width: 500, height: 500 })
    setIsGif(false)
  }

  return {
    src,
    imageElement,
    size,
    handleImageUpload,
    reset,
    isGif,
  }
}

type Gifler = (url: string) => {
  animate(canvas: HTMLCanvasElement): void
  get(callback: (anim: any) => void): void
}

declare global {
  interface Window {
    gifler: Gifler
  }
}
