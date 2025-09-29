import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { QueueContext } from '../context/QueueContext';

export const Navbar = () => {
  const auth = useContext(AuthContext);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (v === 'demo') {
      auth?.setCurrentUser({ id: 'demo-user', username: 'Demo User' });
    } else if (v === 'other') {
      auth?.setCurrentUser({ id: 'other-user', username: 'Other User' });
    }
  };

  const queue = useContext(QueueContext);
  const [open, setOpen] = useState(false);
  const notes = auth?.currentUser ? queue?.getNotifications(auth.currentUser.id) || [] : [];

  const onClear = () => {
    if (!auth?.currentUser) return;
    queue?.clearNotifications(auth.currentUser.id);
    setOpen(false);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="text-lg font-medium">Laundry Queue</div>
        <div className="flex items-center gap-4">
          <nav className="text-sm text-slate-600">Demo — local mock backend</nav>
          <div style={{ position: 'relative' }}>
            <button aria-label="Notifications" onClick={() => setOpen((s) => !s)} className="text-sm">
              🔔 {notes.length > 0 ? `(${notes.length})` : ''}
            </button>
            {open && (
              <div style={{ position: 'absolute', right: 0, top: '1.75rem', background: 'white', border: '1px solid #eee', padding: '0.5rem', width: 300 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>Notifications</div>
                  <button onClick={onClear} style={{ fontSize: 12 }}>Clear</button>
                </div>
                <div style={{ marginTop: 8 }}>
                  {notes.length === 0 && <div style={{ fontSize: 13, color: '#666' }}>No notifications</div>}
                  {notes.map((n) => (
                    <div key={n.id} style={{ padding: '0.25rem 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontSize: 13 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: '#999' }}>{new Date(n.ts).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <select aria-label="Switch user" onChange={onChange} defaultValue="demo" className="text-sm">
            <option value="demo">Demo User</option>
            <option value="other">Other User</option>
          </select>
        </div>
      </div>
    </header>
  );
};
