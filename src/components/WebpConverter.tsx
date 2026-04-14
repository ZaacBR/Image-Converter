import {
  convertImageFileToWebp,
  replaceExtensionWithWebp,
} from '../lib/convertToWebp'
import {
  Download,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useId, useRef, useState } from 'react'

type ItemStatus = 'pending' | 'converting' | 'done' | 'error'

type QueueItem = {
  id: string
  file: File
  objectUrl: string
  status: ItemStatus
  webpBlob: Blob | null
  error: string | null
}

let idCounter = 0
function nextId() {
  idCounter += 1
  return `img-${idCounter}`
}

export function WebpConverter() {
  const inputId = useId()
  const [quality, setQuality] = useState(0.85)
  const [items, setItems] = useState<QueueItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const batchLock = useRef(false)

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const arr = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    setItems((prev) => {
      const next = [...prev]
      for (const file of arr) {
        next.push({
          id: nextId(),
          file,
          objectUrl: URL.createObjectURL(file),
          status: 'pending',
          webpBlob: null,
          error: null,
        })
      }
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const q = prev.find((i) => i.id === id)
      if (q) URL.revokeObjectURL(q.objectUrl)
      return prev.filter((i) => i.id !== id)
    })
  }, [])

  const clearAll = useCallback(() => {
    setItems((prev) => {
      prev.forEach((i) => URL.revokeObjectURL(i.objectUrl))
      return []
    })
  }, [])

  const convertOne = useCallback(async (id: string) => {
    let file: File | null = null
    setItems((prev) => {
      const q = prev.find((i) => i.id === id)
      if (!q || q.status === 'converting') return prev
      file = q.file
      return prev.map((i) =>
        i.id === id ? { ...i, status: 'converting' as const, error: null } : i,
      )
    })
    if (!file) return

    try {
      const blob = await convertImageFileToWebp(file, quality)
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: 'done' as const, webpBlob: blob, error: null }
            : i,
        ),
      )
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Falha ao converter.'
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: 'error' as const,
                error: message,
                webpBlob: null,
              }
            : i,
        ),
      )
    }
  }, [quality])

  const convertAllPending = useCallback(async () => {
    if (batchLock.current) return
    batchLock.current = true
    try {
      const ids = items
        .filter((i) => i.status === 'pending' || i.status === 'error')
        .map((i) => i.id)
      for (const id of ids) {
        await convertOne(id)
      }
    } finally {
      batchLock.current = false
    }
  }, [items, convertOne])

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  const pendingCount = items.filter((i) => i.status === 'pending').length
  const hasWork =
    items.some((i) => i.status === 'pending' || i.status === 'error') &&
    !items.some((i) => i.status === 'converting')

  return (
    <div
      data-converter-root
      className="border border-outline-variant bg-surface p-10 md:p-12 transition-colors duration-500 hover:border-primary group"
    >
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h4 className="font-display text-3xl font-bold uppercase tracking-tighter text-on-surface mb-2">
            Área de conversão
          </h4>
          <p className="font-sans text-sm leading-relaxed text-on-surface-variant max-w-xl">
            Arraste imagens ou clique para selecionar. Ajuste a qualidade WebP e
            converta com processamento 100% local no seu navegador.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer items-center gap-2 border border-outline-variant bg-surface-container px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-white hover:text-black hover:border-white"
          >
            <Upload className="size-4" aria-hidden />
            Selecionar imagens
          </label>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary mb-3">
            Qualidade WebP
          </p>
          <div className="border-l border-outline-variant pl-8">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <span className="font-mono text-4xl font-black text-primary tabular-nums">
                {Math.round(quality * 100)}
              </span>
              <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-on-surface leading-tight">
                Compressão
                <br />
                vs. tamanho
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1}
              step={0.01}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="h-[2px] w-full cursor-pointer appearance-none bg-outline-variant accent-primary"
              aria-label="Qualidade WebP de 50 a 100 por cento"
            />
            <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">
              Valores mais altos preservam mais detalhe e aumentam o peso do
              arquivo.
            </p>
          </div>
        </div>
        <div className="md:col-span-7">
          <motion.div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            animate={
              isDragging
                ? { borderColor: 'var(--color-primary)', scale: 1.01 }
                : { borderColor: 'var(--color-outline-variant)', scale: 1 }
            }
            transition={{ duration: 0.3 }}
            className="flex min-h-[200px] flex-col items-center justify-center border border-dashed border-outline-variant bg-surface-container px-8 py-14 text-center"
          >
            <ImageIcon
              className="mb-4 size-10 text-on-surface-variant"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="font-display text-xl font-bold uppercase tracking-tighter text-on-surface mb-2">
              Solte as imagens aqui
            </p>
            <p className="text-sm text-on-surface-variant">
              PNG, JPEG, GIF, WebP e outros formatos suportados pelo navegador
            </p>
          </motion.div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="border-t border-outline-variant pt-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-on-surface-variant">
              <span className="text-tertiary font-bold tabular-nums">
                {items.length}
              </span>{' '}
              arquivo(s) ·{' '}
              <span className="text-primary font-bold">{pendingCount}</span>{' '}
              pendente(s)
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={convertAllPending}
                disabled={!hasWork}
                className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-40"
              >
                Converter tudo
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center justify-center gap-2 border border-outline-variant px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-white hover:text-black hover:border-white"
              >
                <Trash2 className="size-4" aria-hidden />
                Limpar lista
              </button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group/item border border-outline-variant bg-surface-container-low p-6 transition-colors duration-500 hover:border-primary"
                >
                  <div className="mb-4 flex gap-4">
                    <div className="relative h-36 w-36 shrink-0 border border-outline-variant bg-surface-container overflow-hidden">
                      <img
                        src={item.objectUrl}
                        alt={item.file.name}
                        className="h-full w-full object-cover object-left-top opacity-50 transition-opacity duration-500 group-hover/item:opacity-100"
                      />
                      {item.status === 'converting' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <Loader2
                            className="size-8 animate-spin text-primary"
                            aria-hidden
                          />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[0.6rem] font-bold uppercase tracking-widest text-primary mb-1 truncate">
                        {item.file.type || 'imagem'}
                      </p>
                      <p
                        className="text-2xl font-display font-bold text-on-surface truncate mb-2"
                        title={item.file.name}
                      >
                        {item.file.name}
                      </p>
                      <p className="text-sm text-on-surface-variant mb-3">
                        {(item.file.size / 1024).toFixed(1)} KB
                      </p>
                      {item.error && (
                        <p className="text-xs text-red-400 leading-relaxed mb-3">
                          {item.error}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {(item.status === 'pending' || item.status === 'error') && (
                          <button
                            type="button"
                            onClick={() => void convertOne(item.id)}
                            className="inline-flex items-center gap-2 bg-primary px-4 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-white hover:text-black"
                          >
                            Converter
                          </button>
                        )}
                        {item.status === 'done' && item.webpBlob && (
                          <button
                            type="button"
                            onClick={() =>
                              downloadBlob(
                                item.webpBlob!,
                                replaceExtensionWithWebp(item.file.name),
                              )
                            }
                            className="inline-flex items-center gap-2 border border-outline-variant px-4 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-white hover:text-black hover:border-white"
                          >
                            <Download className="size-4" aria-hidden />
                            Baixar WebP
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-2 px-4 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
                          aria-label={`Remover ${item.file.name}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  )
}
