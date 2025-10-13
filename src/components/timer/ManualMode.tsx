'use client';
import convertToMs from '@/lib/convertToMs';
import formatTime from '@/lib/formatTime';
import { useTimerStore } from '@/store/timerStore';
import { useSettingsModalStore } from '@/store/SettingsModalStore';
import { useTranslations } from 'next-intl';
import MenuSolveOptions from '../menu-solve-options/menu-solve-options';
import { Input } from '../ui/input';
import useSolveData from '@/hooks/useSolveData';

export default function ManualMode() {
  const { saveSolveManualMode, value, setValue } = useSolveData()
  const selectedCube = useTimerStore(store => store.selectedCube);
  const lastSolve = useTimerStore(store => store.lastSolve);
  const setLastSolve = useTimerStore(store => store.setLastSolve);
  const settings = useSettingsModalStore(store => store.settings);
  const t = useTranslations('Index.HomePage');

  const isValidInput = (input: string) => {
    return /^[0-9]*$/.test(input) && parseInt(input) > 0;
  };

  const handleOnTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCube) return;
    if (
      (isValidInput(e.target.value) &&
        parseInt(e.target.value) <= 595959) ||
      e.target.value === ''
    ) {
      setValue(e.target.value);
    }
  }

  if (!selectedCube) return null;

  return (
    <>
      <form
        className="flex flex-col items-center grow justify-center"
        onSubmit={saveSolveManualMode}
      >
        <Input
          autoComplete="off"
          name="time"
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="..."
          value={value}
          className={`w-full max-w-[500px] h-20 text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-center border rounded-md outline-hidden appearance-none cursor-pointer focus:cursor-text py-14`}
          onChange={handleOnTyping}
        />
        {value !== '' ? (
          <div className="mt-1 text-center font-mono">
            {t('preview')}: {formatTime(convertToMs(value))}{' '}
          </div>
        ) : null}
        {lastSolve && (
          <div className="mt-2 text-center font-mono text-muted-foreground">
            Last one: {formatTime(lastSolve.time)}
          </div>
        )}
      </form>
      {lastSolve && settings.features.quickActionButtons ? (
        <MenuSolveOptions
          solve={lastSolve}
          onDeleteSolve={() => setLastSolve(null)}
          caseOfUse="last-solve"
        />
      ) : null}
    </>
  );
}
