import { Stage as KonvaStage } from 'konva/lib/Stage'

export const downloadStage = (konvaStage: KonvaStage | null, name = 'njz-meme.png') => {
  if (!konvaStage) return
  const uri = konvaStage.toDataURL({ pixelRatio: 2 })
  const link = document.createElement('a')
  link.href = uri
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
