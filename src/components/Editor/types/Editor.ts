export type EditorImage = GifImage | MemeImage
export interface GifImage extends ImageType {
  type: 'gif'
}

export interface MemeImage extends ImageType {
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
