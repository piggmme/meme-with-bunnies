import { useEffect, useRef } from 'react'

export default function useInfiniteScroll (fetcher: () => void) {
  const intersectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          fetcher() // fetcher 함수 호출
        }
      },
      {
        root: null, // 뷰포트를 기준으로 관찰
        rootMargin: '0px',
        threshold: 1.0, // 요소가 100% 뷰포트에 들어왔을 때 트리거
      },
    )

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current)
    }

    return () => {
      if (intersectionRef.current) {
        observer.unobserve(intersectionRef.current)
      }
    }
  }, [fetcher])

  return intersectionRef // ref를 반환하여 컴포넌트에서 연결
}
