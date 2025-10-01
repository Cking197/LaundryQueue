import { QueueProvider } from './context/QueueContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { MachineGrid } from './components/MachineGrid';

export default function App() {
  return (
    <AuthProvider>
      <QueueProvider>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main className="p-4 max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Laundry Queue</h1>
            <MachineGrid />
          </main>
        </div>
      </QueueProvider>
    </AuthProvider>
  );
}
