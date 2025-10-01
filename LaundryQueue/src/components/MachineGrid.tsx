import { useContext } from 'react';
import { QueueContext } from '../context/QueueContext';
import { MachineCard } from './MachineCard';

export const MachineGrid = () => {
  const ctx = useContext(QueueContext);
  if (!ctx) return null;
  const { machines } = ctx;
  return (
    <div className="machine-grid-2x3">
      {machines.map((m) => (
        <MachineCard key={m.id} machine={m} />
      ))}
    </div>
  );
};
