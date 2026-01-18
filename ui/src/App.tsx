import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { UserProvider } from './context/UserContext';
import { HomePage } from './pages/home/HomePage';
import { ChatPage } from './pages/chat/ChatPage';
import { MarketPage } from './pages/market/MarketPage';
import { StarterPage } from './pages/starter/StarterPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { DuelPage } from './pages/duel/DuelPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { LandscapePrompt } from './components/shared/LandscapePrompt';

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <LandscapePrompt />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/dapp" element={<StarterPage />} />
          <Route path="/duel" element={<DuelPage />} />
          <Route path="/inventory" element={<InventoryPage />} />

          {/* Placeholder Routes */}
          <Route path="/deck" element={<ComingSoonPage />} />
          <Route path="/profile" element={<ComingSoonPage />} />
          <Route path="/history" element={<ComingSoonPage />} />
        </Routes>
      </UserProvider>
    </ToastProvider>
  );
}

export default App;