import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import coreURL from '@ffmpeg/core?url'
import wasmURL from '@ffmpeg/core/wasm?url'

const RESULT_NAME = 'njz-meme'
const RECORDING_TIME = 5000

async function convertWebmToGif (webmBlob: Blob): Promise<Blob> {
  const ffmpeg = new FFmpeg()

  // ffmpeg 초기화
  await ffmpeg.load({ coreURL, wasmURL })

  // WebM 파일을 ffmpeg에 쓰기
  await ffmpeg.writeFile('input.webm', await fetchFile(webmBlob))

  // WebM을 GIF로 변환
  await ffmpeg.exec([
    '-i',
    'input.webm',
    '-vf',
    [
      'fps=30', // 프레임 레이트 증가
      'scale=720:-1:flags=lanczos', // 해상도 증가, lanczos 스케일링
      'split[s0][s1]',
      '[s0]palettegen=stats_mode=diff[p]', // 향상된 팔레트 생성
      '[s1][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle', // 디더링 개선
    ].join(','),
    '-loop',
    '0', // 무한 반복
    'output.gif',
  ])

  // 변환된 GIF 파일 읽기
  const data = await ffmpeg.readFile('output.gif')

  return new Blob([data], { type: 'image/gif' })
}

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

function exportFile (url: string, name = RESULT_NAME) {
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportVid (blob: Blob, name = RESULT_NAME) {
  const url = URL.createObjectURL(blob)
  exportFile(url, name)
  URL.revokeObjectURL(url)
}

function exportPng (konvaStage: KonvaStage, name = RESULT_NAME) {
  const url = konvaStage.toDataURL({ pixelRatio: 2 })
  exportFile(url, name)
}

export const downloadPng = (konvaStage: KonvaStage | null, name = RESULT_NAME) => {
  if (!konvaStage) return
  exportPng(konvaStage, name)
}

type MemeType = 'gif' | 'video'
export const downloadGif = async (konvaLayer: KonvaLayer | null, type: MemeType = 'gif', name = RESULT_NAME) => {
  if (!konvaLayer) return
  const webmBlob = await startRecording(konvaLayer)

  if (type === 'video') {
    exportVid(webmBlob, name.replace('.webm', '.mp4'))
  } else if (type === 'gif') {
    const gifBlob = await convertWebmToGif(webmBlob)
    exportVid(gifBlob, name.replace('.webm', '.gif'))
  }
}
