import { useEffect, useState } from 'react'

function readValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return initialValue
    return JSON.parse(raw) as T
  } catch {
    return initialValue
  }
}

export const useLocalStorageState = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => readValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key } }))
    } catch {
      // Ignore write failures (private mode / quota exceeded)
    }
  }, [key, value])

  return [value, setValue] as const
}
