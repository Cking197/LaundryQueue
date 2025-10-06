import { createContext, useEffect, useState } from 'react';

export type MachineState = 'available' | 'in-use' | 'finished';

export type Machine = {
  id: string;
  label: string;
  state: MachineState;
  ownerId?: string | null;
  ownerName?: string | null;
  startTime?: string | null; // ISO
  durationMin?: number | null;
};

type QueueContextValue = {
  machines: Machine[];
  startMachine: (id: string, userId: string, durationMin: number, ownerName?: string) => void;
  finishMachine: (id: string) => void;
  sendReminder: (id: string, fromUserId: string) => boolean;
  getNotifications: (userId: string) => Array<{ id: string; message: string; ts: number }>;
  clearNotifications: (userId: string) => void;
};

export const QueueContext = createContext<QueueContextValue | null>(null);

const INITIAL_MACHINES: Machine[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `m${i + 1}`,
  label: i < 3 ? `W${i + 1}` : `D${i - 2}`,
  state: 'available',
  ownerId: null,
  startTime: null,
  durationMin: null,
}));

export const QueueProvider = ({ children }: any) => {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);

  useEffect(() => {
    const t = setInterval(() => {
      setMachines((prev) =>
        prev.map((m) => {
          if (m.state !== 'in-use' || !m.startTime || !m.durationMin) return m;
          const finish = new Date(m.startTime).getTime() + m.durationMin * 60_000;
          if (Date.now() >= finish) {
            console.log({ timestamp: new Date().toISOString(), machineId: m.id, action: 'finished', userId: m.ownerId, duration: m.durationMin, result: 'auto' });
            return { ...m, state: 'finished' as MachineState };
          }
          return m;
        }),
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const startMachine = (id: string, userId: string, durationMin: number, ownerName?: string) => {
    setMachines((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, state: 'in-use', ownerId: userId, ownerName: ownerName || null, startTime: new Date().toISOString(), durationMin }
          : m,
      ),
    );
    console.log({ timestamp: new Date().toISOString(), machineId: id, action: 'start', userId, ownerName, duration: durationMin });
  };

  const finishMachine = (id: string) => {
    setMachines((prev) => prev.map((m) => (m.id === id ? { ...m, state: 'available', ownerId: null, startTime: null, durationMin: null } : m)));
    console.log({ timestamp: new Date().toISOString(), machineId: id, action: 'picked_up' });
  };

  // Simple reminder throttle per machine (in-memory)
  const reminderTracker: Record<string, { lastSent?: number; count?: number }> = {};

  // Simple in-memory notifications keyed by userId
  const notifications: Record<string, Array<{ id: string; message: string; ts: number }>> = {};

  const getNotifications = (userId: string) => {
    return notifications[userId] || [];
  };

  const clearNotifications = (userId: string) => {
    notifications[userId] = [];
  };

  const sendReminder = (id: string, fromUserId: string) => {
    const m = machines.find((x) => x.id === id);
    if (!m || !m.ownerId) return false;
    const now = Date.now();
    const rec = reminderTracker[id] || {};
    if (rec.lastSent && now - rec.lastSent < 30_000 && (rec.count || 0) >= 3) {
      return false; // throttled
    }
    rec.lastSent = now;
    rec.count = (rec.count || 0) + 1;
    reminderTracker[id] = rec;
    console.log({ timestamp: new Date().toISOString(), machineId: id, action: 'reminder', from: fromUserId, to: m.ownerId });

    // push a simple notification for the owner
    const note = { id: `${id}-${Date.now()}`, message: `Reminder: please pick up ${m.label}`, ts: Date.now() };
    if (!notifications[m.ownerId!]) notifications[m.ownerId!] = [];
    notifications[m.ownerId!].push(note);
    return true;
  };

  return (
    <QueueContext.Provider value={{ machines, startMachine, finishMachine, sendReminder, getNotifications, clearNotifications }}>
      {children}
    </QueueContext.Provider>
  );
};
