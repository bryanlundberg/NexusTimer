import type { Appearance, FaceletStickering } from './facelet-source'

export function maskStickering(
  id: string,
  stickerCount: number,
  appearanceOf: (sticker: number) => Appearance
): FaceletStickering {
  const appearances = new Uint8Array(stickerCount)
  for (let sticker = 0; sticker < stickerCount; sticker++) appearances[sticker] = appearanceOf(sticker)
  return { id, appearanceOf: (sticker) => appearances[sticker] as Appearance }
}
