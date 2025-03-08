import { useEffect, useState } from 'react'
import 'gifler'
import type { EditorImage } from '../types/Editor'

export function useImageUpload (onUpload: (image: EditorImage) => void) {
  const [src, setSrc] = useState<string | null>(null)
  const [type, setType] = useState<'gif' | 'image' | null>(null)

  const handleImageUpload = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      setType(file.type === 'image/gif' ? 'gif' : 'image')
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setSrc(result)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (type && src) {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        onUpload({
          type,
          id: String(Date.now()),
          src,
          image: img,
          size: {
            width: img.width / 2,
            height: img.height / 2,
          },
        })
        setSrc(null)
        setType(null)
      }
    }
  }, [src, type])

  return {
    handleImageUpload,
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
