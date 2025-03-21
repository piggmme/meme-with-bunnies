import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'

export const njzs = [
  {
    name: 'teddy bear',
    emoji: '🧸',
  },
  {
    name: 'otter',
    emoji: '🦦',
  },
  {
    name: 'cat',
    emoji: '🐱',
  },
  {
    name: 'dog',
    emoji: '🐶',
  },
  {
    name: 'hamster',
    emoji: '🐹',
  },
]

export const $activeQuery = atom<string>(njzs[0].name)

export function useActiveQuery () {
  const activeQuery = useStore($activeQuery)
  return [activeQuery, (query: string) => $activeQuery.set(query)] as const
}
