import { $canvasBackground } from '@/stores/canvasState'
import { useStore } from '@nanostores/react'

export default function BackgroundController () {
  const canvasBackground = useStore($canvasBackground)

  return (
    <div style={{ marginBottom: 10 }}>
      <label>
        배경색:
        <input
          type='color'
          value={canvasBackground}
          onChange={e => $canvasBackground.set(e.target.value)}
        />
      </label>
    </div>
  )
}
