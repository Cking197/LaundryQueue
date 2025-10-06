import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueueProvider, QueueContext } from './QueueContext';
import { AuthProvider } from './AuthContext';
import { useContext, useEffect } from 'react';

const TestApp = () => {
  const q = useContext(QueueContext)!;

  useEffect(() => {
    // start machine m1 owned by demo-user
    q.startMachine('m1', 'demo-user', 1, 'Demo User');
  }, []);

  // when machines update and owner is set, send reminder
  useEffect(() => {
    const m = q.machines.find((x) => x.id === 'm1');
    if (m && m.ownerId) {
      const ok = q.sendReminder('m1', 'other-user');
      const notes = q.getNotifications('demo-user');
      // render counts into DOM for assertions
      const el = document.getElementById('out')!;
      el.textContent = `${ok ? 'ok' : 'no'}|${notes.length}|${notes[0]?.message || ''}`;
    }
  }, [q.machines]);

  return <div id="out" />;
};

describe('QueueContext notifications', () => {
  it('pushes a notification to owner when reminder is sent', async () => {
    render(
      <AuthProvider>
        <QueueProvider>
          <TestApp />
        </QueueProvider>
      </AuthProvider>,
    );

    const out = await screen.findByText(/ok\|1\|/);
    expect(out).toBeTruthy();
  });
});
