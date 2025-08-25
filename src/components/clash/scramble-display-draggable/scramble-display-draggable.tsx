import { Rnd } from 'react-rnd';
import { ScrambleDisplay } from '@/components/scramble-display';
import { useClashWindows } from '@/store/clash-windows';

export default function ScrambleDisplayDraggable() {
  const scramble = useClashWindows((s) => s.scramble);
  const setPosition = useClashWindows((s) => s.setPosition);
  const setSize = useClashWindows((s) => s.setSize);

  if (!scramble.isOpen) return null;

  return (
    <Rnd
      className={'z-0 rounded-md shadow-md bg-card border border-border opacity-80'}
      default={{
        x: scramble.x,
        y: scramble.y,
        width: scramble.width,
        height: scramble.height,
      }}
      minWidth={100}
      minHeight={100}
      maxWidth={400}
      maxHeight={400}
      bounds="parent"
      onDragStop={(e, d) => setPosition('scramble', d.x, d.y)}
      onResizeStop={(e, dir, ref, delta, position) => {
        const width = parseFloat(ref.style.width);
        const height = parseFloat(ref.style.height);
        setSize('scramble', width, height);
        setPosition('scramble', position.x, position.y);
      }}
    >
      <ScrambleDisplay
        className={'w-full h-full'}
        show={true}
        scramble={'D2 F\' L U R2 F U F\' U B2 L2 U L2 U F2 U\' R2 D2 F2 D L'}
        event={'3x3'}
      />
    </Rnd>
  )
}
