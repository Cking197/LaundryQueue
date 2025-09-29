import { useContext, useEffect, useMemo, useState } from 'react';
import type { Machine } from '../context/QueueContext';
import { QueueContext } from '../context/QueueContext';

const formatRemaining = (finishTs?: string | null) => {
  if (!finishTs) return null;
  const ms = new Date(finishTs).getTime() - Date.now();
  if (ms <= 0) return '00:00';
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const MachineCard = ({ machine }: { machine: Machine }) => {
  const ctx = useContext(QueueContext);
  if (!ctx) return null;
  const { startMachine, finishMachine, sendReminder } = ctx;
  const [nowTick, setNowTick] = useState(0);
  // nowTick forces re-render every second; underscore usage prevents "unused" lint in some configs
  void nowTick;

  useEffect(() => {
    const t = setInterval(() => setNowTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const finishTs = useMemo(() => {
    if (machine.startTime && machine.durationMin) {
      return new Date(new Date(machine.startTime).getTime() + machine.durationMin * 60_000).toISOString();
    }
    return null;
  }, [machine.startTime, machine.durationMin]);

  const remaining = formatRemaining(finishTs);

  const onStart = () => {
    const duration = Number(prompt('Duration minutes', String(machine.durationMin || 35))) || 35;
    startMachine(machine.id, 'demo-user', duration);
  };

  const onFinish = () => {
    finishMachine(machine.id);
  };

  const onReminder = () => {
    const ok = sendReminder(machine.id, 'demo-user');
    alert(ok ? 'Reminder sent' : 'Reminder throttled');
  };

  const bg = machine.state === 'available' ? 'bg-emerald-50' : machine.state === 'in-use' ? 'bg-rose-50' : 'bg-amber-50';
  const blink = machine.state === 'finished' ? 'blink-red' : '';

  return (
    <div className={`p-4 rounded border ${bg} ${blink}`}> 
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">{machine.label}</div>
        <div className="text-sm text-slate-500">{machine.state}</div>
      </div>
      <div className="mt-2 text-sm">
        {machine.state === 'available' && <div className="text-emerald-700">Available</div>}
        {machine.state === 'in-use' && <div className="text-rose-700">In use — {remaining}</div>}
        {machine.state === 'finished' && <div className="text-amber-700">Finished — ready to pick up</div>}
      </div>
      <div className="mt-4 flex gap-2">
        {machine.state === 'available' && (
          <button onClick={onStart} className="px-3 py-1 bg-emerald-600 text-white rounded">Start</button>
        )}
        {machine.state !== 'available' && (
          <button onClick={onReminder} className="px-3 py-1 bg-slate-200 rounded">Send reminder</button>
        )}
        {machine.state === 'finished' && (
          <button onClick={onFinish} className="px-3 py-1 bg-emerald-500 text-white rounded">Mark picked up</button>
        )}
      </div>
    </div>
  );
};
