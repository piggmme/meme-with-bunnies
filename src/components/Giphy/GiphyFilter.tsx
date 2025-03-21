import { njzs, useActiveQuery } from '@/stores/giphyState'

export default function GiphyFilter () {
  const [actoveQuery, setActiveQuery] = useActiveQuery()

  return (
    <div className='flex gap-2'>
      {njzs.map(njz => (
        <Button
          key={njz.name}
          active={actoveQuery === njz.name}
          onClick={() => {
            setActiveQuery(njz.name)
          }}
        >{njz.emoji}
        </Button>
      ))}
      <Button
        active={njzs.every(njz => njz.name !== actoveQuery)}
        onClick={() => setActiveQuery('')}
      >
        🔍
      </Button>
    </div>
  )
}

function Button ({ active, ...props }: React.ComponentProps<'button'> & { active: boolean }) {
  return (
    <button
      className={`
      text-3xl py-1 px-2 rounded-md box-content shadow-md
      ${active ? 'shadow-md border border-gray-300' : 'border border-transparent'}
    `}
      {...props}
    />
  )
}
