import ChartResults from '@/components/clash/chart-results/chart-results';
import { Button } from '@/components/ui/button';

// IDEAS, INCLUDE PERCENTAGE CLEAN SOLVES - 0 100%
// ADD EACH INDIVIDUAL SOLVE
// RANKS ADD SOME COLOR
// HIGHTLIGHT CURRENT USER IN TABLE

export default function MatchFinished() {
  return (
    <div className={'max-w-7xl mx-auto mt-5'}>
      <h1 className={'text-3xl font-bold mb-4 text-center'}>RESULTS</h1>
      <ChartResults/>

      <div className={"flex justify-center mt-6"}>
        <Button>Back to lobby</Button>
      </div>
    </div>
  )
}
