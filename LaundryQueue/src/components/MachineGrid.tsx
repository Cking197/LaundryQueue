import { useContext } from 'react';
import { QueueContext } from '../context/QueueContext';
import { MachineCard } from './MachineCard';

export const MachineGrid = () => {
  const ctx = useContext(QueueContext);
  if (!ctx) return null;
  const { machines } = ctx;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {machines.map((m) => (
        <MachineCard key={m.id} machine={m} />
      ))}
    </div>
  );
};
