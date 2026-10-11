import { DIGIT_CELL_CLASS, isDigit } from '@/shared/lib/digitCells'

export default function DigitCells({ text }: { text: string }) {
  return (
    <>
      {[...text].map((char, i) => (
        <span key={i} className={isDigit(char) ? DIGIT_CELL_CLASS : undefined}>
          {char}
        </span>
      ))}
    </>
  )
}
