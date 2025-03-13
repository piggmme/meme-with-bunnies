export type CanvasImage = GifImage | PngImage
export interface GifImage extends ImageType {
  type: 'gif'
}

export interface PngImage extends ImageType {
  type: 'image'
  image: HTMLImageElement
}

export interface ImageType {
  id: string
  src: string
  size: {
    width: number
    height: number
  }
}
