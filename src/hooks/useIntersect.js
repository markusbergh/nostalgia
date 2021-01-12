import { useEffect, useRef, useState } from 'react'

const useIntersect = ({ root = null, rootMargin, threshold = 0 }) => {
  const [entry, updateEntry] = useState(false)
  const [node, setNode] = useState(null)
  const observer = useRef()

  useEffect(() => {
    let callback = entries => {
      entries.forEach(entry => {
        updateEntry(entry)
      })
    }

    observer.current = new IntersectionObserver(callback, {
      root,
      rootMargin,
      threshold,
    })

    const { current: currentObserver } = observer
    currentObserver.disconnect()

    if (node) {
      currentObserver.observe(node)
    }

    return () => {
      return currentObserver.disconnect()
    }
  }, [node])

  return [setNode, entry]
}

export default useIntersect
