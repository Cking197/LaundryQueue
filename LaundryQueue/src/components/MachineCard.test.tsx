import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueueProvider } from '../context/QueueContext';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { MachineCard } from './MachineCard';
import type { Machine } from '../context/QueueContext';

const machineOwned: Machine = {
  id: 'm1',
  label: 'W1',
  state: 'in-use',
  ownerId: 'demo-user',
  ownerName: 'Demo User',
  startTime: new Date().toISOString(),
  durationMin: 30,
};

describe('MachineCard reminder visibility', () => {
  it('does not show Send reminder to the owner', () => {
    render(
      <AuthProvider>
        <QueueProvider>
          <MachineCard machine={machineOwned} />
        </QueueProvider>
      </AuthProvider>,
    );

    const btn = screen.queryByText('Send reminder');
    expect(btn).toBeNull();
  });

  it('shows Send reminder to other users', async () => {
    // render with Other User as current user
    render(
      <AuthContext.Provider value={{ currentUser: { id: 'other-user', username: 'Other' }, setCurrentUser: () => {} }}>
        <QueueProvider>
          <MachineCard machine={machineOwned} />
        </QueueProvider>
      </AuthContext.Provider>,
    );

    const btn = await screen.findByText('Send reminder');
    expect(btn).toBeTruthy();
  });
});
