import { useEffect, useState } from 'react'

export function useImageUpload () {
  const [src, setSrc] = useState<string | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [size, setSize] = useState({ width: 500, height: 500 })

  const handleImageUpload = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setSrc(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const reset = () => {
    setSrc(null)
    setImageElement(null)
    setSize({ width: 500, height: 500 })
  }

  useEffect(() => {
    if (src) {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        setImageElement(img)
        setSize({ width: img.width / 2, height: img.height / 2 }) // 기본 크기 조정
      }
    }
  }, [src])

  return {
    src, imageElement, size, handleImageUpload, reset,
  }
}
