import { useEffect, useState } from 'react'

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const useLocalStorageValue = <T,>(key: string, fallback: T) => {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback))

  useEffect(() => {
    const syncFromStorage = () => {
      setValue(readStoredValue(key, fallback))
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        syncFromStorage()
      }
    }

    const onInternalUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ key?: string }>
      if (!customEvent.detail?.key || customEvent.detail.key === key) {
        syncFromStorage()
      }
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener('local-storage-update', onInternalUpdate)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('local-storage-update', onInternalUpdate)
    }
  }, [key, fallback])

  return value
}
