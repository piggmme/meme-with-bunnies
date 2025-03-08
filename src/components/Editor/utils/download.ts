import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'

const RESULT_NAME = 'njz-meme'
const RECORDING_TIME = 5000

function startRecording (konvaLayer: KonvaLayer): Promise<Blob> {
  return new Promise((resolve) => {
    const chunks: Blob[] = []
    const stream = konvaLayer.getNativeCanvasElement().captureStream(30)
    const rec = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
    })

    rec.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    rec.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      resolve(blob)
    }

    rec.start(100)

    setTimeout(() => {
      rec.stop()
    }, RECORDING_TIME)
  })
}

function exportVid (blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'meme.webm'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function exportPng (konvaStage: KonvaStage, name = RESULT_NAME) {
  const uri = konvaStage.toDataURL({ pixelRatio: 2 })
  const link = document.createElement('a')
  link.href = uri
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const downloadPng = (konvaStage: KonvaStage | null, name = RESULT_NAME) => {
  if (!konvaStage) return
  exportPng(konvaStage, name)
}

export const downloadGif = async (konvaLayer: KonvaLayer | null) => {
  if (!konvaLayer) return
  const blob = await startRecording(konvaLayer)
  exportVid(blob)
}
