'use client';
import Navigation from '@/components/navigation/navigation';
import CategoryStatistics from '@/components/stats/CategoryStatistics';
import FadeIn from '@/components/fade-in/fade-in';

export default function Page() {
  return (
    <div className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <div className="px-2 pt-2 flex flex-col w-full min-h-full">
          <Navigation showMainCubeSelector/>
          <CategoryStatistics/>
        </div>
      </FadeIn>
    </div>
  );
}
