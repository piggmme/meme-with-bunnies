import { resetCanvasState } from '@/stores/canvasState'
import { Button } from '../ui/button'

export default function ResetController () {
  return (
    <Button onClick={resetCanvasState}>
      초기화
    </Button>
  )
}
