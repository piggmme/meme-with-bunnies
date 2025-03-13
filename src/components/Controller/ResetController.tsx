import { resetEditorState } from '@/stores/editorState'
import { Button } from '../ui/button'

export default function ResetController () {
  return (
    <Button onClick={resetEditorState}>
      초기화
    </Button>
  )
}
