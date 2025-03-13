import { $editorBackground } from '@/stores/editorState'
import { useStore } from '@nanostores/react'

export default function BackgroundController () {
  const editorBackground = useStore($editorBackground)

  return (
    <div style={{ marginBottom: 10 }}>
      <label>
        배경색:
        <input
          type='color'
          value={editorBackground}
          onChange={e => $editorBackground.set(e.target.value)}
        />
      </label>
    </div>
  )
}
