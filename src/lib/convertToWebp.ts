/** Converte um arquivo de imagem raster para WebP via canvas. */
export async function convertImageFileToWebp(
  file: File,
  quality: number,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file)

  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Não foi possível criar o contexto 2D.')
  }

  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/webp', quality)
  })

  if (!blob) {
    throw new Error(
      'Este navegador não suporta exportação WebP a partir do canvas. Tente Chrome ou Edge.',
    )
  }

  return blob
}

export function replaceExtensionWithWebp(filename: string): string {
  const i = filename.lastIndexOf('.')
  const base = i === -1 ? filename : filename.slice(0, i)
  return `${base}.webp`
}
