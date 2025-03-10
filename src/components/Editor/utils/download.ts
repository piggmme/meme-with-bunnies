import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import coreURL from '@ffmpeg/core?url'
import wasmURL from '@ffmpeg/core/wasm?url'

const RESULT_NAME = 'njz-meme'
const RECORDING_TIME = 5000

async function convertVideoToGif (videoBlob: Blob): Promise<Blob> {
  const ffmpeg = new FFmpeg()
  await ffmpeg.load({ coreURL, wasmURL })

  // 입력 파일 확장자를 MIME 타입에 따라 설정
  const inputExt = videoBlob.type.includes('webm') ? 'webm' : 'mp4'
  const inputFile = `input.${inputExt}`

  // 파일 쓰기
  await ffmpeg.writeFile(inputFile, await fetchFile(videoBlob))

  // 비디오를 GIF로 변환
  await ffmpeg.exec([
    '-i',
    inputFile,
    '-vf',
    [
      'fps=30',
      'scale=720:-1:flags=lanczos',
      'split[s0][s1]',
      '[s0]palettegen=stats_mode=diff[p]',
      '[s1][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle',
    ].join(','),
    '-loop',
    '0',
    'output.gif',
  ])

  const data = await ffmpeg.readFile('output.gif')
  return new Blob([data], { type: 'image/gif' })
}

const getMimeType = () => {
  // Safari와 다른 브라우저 지원을 위한 MIME 타입 확인
  let mimeType = 'video/mp4'

  // WebM 지원 확인
  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    mimeType = 'video/webm;codecs=vp9'
  } else if (MediaRecorder.isTypeSupported('video/webm')) {
    mimeType = 'video/webm'
  }

  return mimeType
}

function startRecording (konvaLayer: KonvaLayer): Promise<Blob> {
  return new Promise((resolve) => {
    const chunks: Blob[] = []
    const stream = konvaLayer.getNativeCanvasElement().captureStream(30)

    const mimeType = getMimeType()

    const rec = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 5000000, // 비트레이트 설정
    })

    rec.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    rec.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType })
      resolve(blob)
    }

    rec.start(100)

    setTimeout(() => {
      rec.stop()
    }, RECORDING_TIME)
  })
}

const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

async function exportFileMobile (url: string, name = RESULT_NAME) {
  try {
    // Blob으로 변환
    const response = await fetch(url)
    const blob = await response.blob()

    if (!navigator.canShare) {
      console.log(`Your browser doesn't support the Web Share API.`)
      return
    }

    // 파일 공유 API 사용
    const file = new File([blob], name, { type: blob.type })
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: '밈 저장하기',
      })
      return
    }
  } catch (error) {
    console.error('공유 중 오류 발생:', error)
  }
}

function exportFileDesktop (url: string, name = RESULT_NAME) {
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function exportFile (url: string, name = RESULT_NAME) {
  if (isMobile()) {
    console.log('isMobile', navigator.userAgent)
    await exportFileMobile(url, name)
  } else {
    exportFileDesktop(url, name)
  }
}

async function exportVid (blob: Blob, name = RESULT_NAME) {
  const url = URL.createObjectURL(blob)
  await exportFile(url, name)
  URL.revokeObjectURL(url)
}

async function exportPng (konvaStage: KonvaStage, name = RESULT_NAME) {
  const url = konvaStage.toDataURL({ pixelRatio: 2 })
  await exportFile(url, name)
}

export const downloadPng = async (konvaStage: KonvaStage | null, name = RESULT_NAME) => {
  if (!konvaStage) return
  await exportPng(konvaStage, name)
}

type MemeType = 'gif' | 'video'
export const downloadGif = async (konvaLayer: KonvaLayer | null, type: MemeType = 'gif', name = RESULT_NAME) => {
  if (!konvaLayer) return

  try {
    const videoBlob = await startRecording(konvaLayer)

    if (type === 'video') {
      await exportVid(videoBlob, name)
    } else if (type === 'gif') {
      const gifBlob = await convertVideoToGif(videoBlob)
      await exportVid(gifBlob, name)
    }
  } catch (error) {
    console.error('다운로드 중 오류 발생:', error)
    throw error
  } finally {
    console.log('끝!!')
  }
}
