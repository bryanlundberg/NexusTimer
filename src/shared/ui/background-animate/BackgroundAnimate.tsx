import { FireworksBackground } from '@/components/ui/shadcn-io/fireworks-background'

export default function BackgroundAnimate() {
  return (
    <div className="absolute inset-0 z-1">
      <FireworksBackground
        fireworkSpeed={{ min: 8, max: 16 }}
        fireworkSize={{ min: 4, max: 10 }}
        particleSpeed={{ min: 4, max: 14 }}
        particleSize={{ min: 2, max: 10 }}
      />
    </div>
  )
}
