'use client'
import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useVirtualKeymapStore } from '@/features/timer/model/useVirtualKeymapStore'
import { useKeyboardLayoutLabels } from '@/features/timer/model/useKeyboardLayoutLabels'
import { VIRTUAL_KEYBOARD_ROWS } from '@/features/timer/model/virtualKeymap'
import VirtualKeymapKey from '@/features/timer/ui/VirtualKeymapKey'

const ROW_PADDING = ['0', 'calc(var(--key-w) * 0.25)', 'calc(var(--key-w) * 0.6)', 'calc(var(--key-w) * 0.9)']

export default function VirtualKeymapEditor() {
  const keymap = useVirtualKeymapStore((store) => store.keymap)
  const setBinding = useVirtualKeymapStore((store) => store.setBinding)
  const resetKeymap = useVirtualKeymapStore((store) => store.resetKeymap)
  const setEditorOpen = useVirtualKeymapStore((store) => store.setEditorOpen)

  const layoutLabels = useKeyboardLayoutLabels()
  const [pressedCode, setPressedCode] = useState<string | null>(null)

  useEffect(() => {
    setEditorOpen(true)
    return () => setEditorOpen(false)
  }, [setEditorOpen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => setPressedCode(e.code)
    const clearPressed = () => setPressedCode(null)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', clearPressed)
    window.addEventListener('blur', clearPressed)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', clearPressed)
      window.removeEventListener('blur', clearPressed)
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="@container w-full">
        <div className="mx-auto flex w-fit flex-col gap-(--key-gap) [--key-gap:min(0.375rem,1cqw)] [--key-h:min(3rem,8.4cqw)] [--key-w:min(2.75rem,7.3cqw)]">
          {VIRTUAL_KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-(--key-gap)" style={{ paddingLeft: ROW_PADDING[rowIndex] }}>
              {row.map((code) => (
                <VirtualKeymapKey
                  key={code}
                  code={code}
                  label={layoutLabels[code] ?? code}
                  move={keymap[code]}
                  isPressed={pressedCode === code}
                  onSelect={setBinding}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={resetKeymap}>
          <RotateCcw />
          Restore defaults
        </Button>
      </div>
    </div>
  )
}
