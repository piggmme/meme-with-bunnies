import { resetCanvasState } from '@/stores/canvasState'
import { Button } from '../ui/button'
import { ResetIcon } from '@radix-ui/react-icons'

export default function ResetController () {
  return (
    <Button variant='ghost' className='text-gray-600 flex flex-col items-center text-xs' onClick={resetCanvasState}>
      <ResetIcon width={25} height={25} />
      초기화
    </Button>
  )
}
