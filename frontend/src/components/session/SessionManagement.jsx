import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayIcon,
  StopIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import useUserStore from '../../stores/useUserStore';
import api from '../../services/api';

const SessionManagement = () => {
  const [requestId, setRequestId] = useState('');
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [activeTab, setActiveTab] = useState('start'); // 'start', 'active', 'end'

  const { kullanici, girisYapildi } = useUserStore();

  useEffect(() => {
    if (girisYapildi && kullanici) {
      setUserId(kullanici.id.toString());
      checkActiveSession();
    }
  }, [girisYapildi, kullanici]);

  const checkActiveSession = async () => {
    if (!kullanici) return;
    
    try {
      const session = await api.session.getActiveSession(kullanici.id);
      setActiveSession(session);
    } catch (error) {
      console.error('Active session check error:', error);
      setActiveSession(null);
    }
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    
    if (!requestId) {
      setMessage('Lütfen request ID girin');
      return;
    }

    setLoading(true);
    try {
      const result = await api.session.startSession(parseInt(requestId));
      setMessage('Seans başarıyla başlatıldı!');
      setRequestId('');
      await checkActiveSession();
    } catch (error) {
      console.error('Start session error:', error);
      setMessage('Seans başlatılırken hata oluştu: ' + api.utils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckActiveSession = async (e) => {
    e.preventDefault();
    
    const targetUserId = userId || (kullanici ? kullanici.id : null);
    if (!targetUserId) {
      setMessage('Lütfen user ID girin');
      return;
    }

    setLoading(true);
    try {
      const session = await api.session.getActiveSession(parseInt(targetUserId));
      setActiveSession(session);
      setMessage('Aktif seans bilgileri güncellendi');
    } catch (error) {
      console.error('Get active session error:', error);
      setActiveSession(null);
      setMessage('Aktif seans bulunamadı: ' + api.utils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async (e) => {
    e.preventDefault();
    
    if (!sessionId) {
      setMessage('Lütfen session ID girin');
      return;
    }

    setLoading(true);
    try {
      const result = await api.session.endSession(parseInt(sessionId));
      setMessage('Seans başarıyla sonlandırıldı!');
      setSessionId('');
      setActiveSession(null);
      await checkActiveSession();
    } catch (error) {
      console.error('End session error:', error);
      setMessage('Seans sonlandırılırken hata oluştu: ' + api.utils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => setMessage('');

  const tabButtonClass = (isActive) => `
    px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 transition-colors
    ${isActive 
      ? 'text-blue-600 border-blue-600 bg-blue-50' 
      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
    }
  `;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClockIcon className="w-8 h-8 text-blue-600" />
          Seans Yönetimi
        </h2>
        <p className="text-gray-600 mt-1">
          Gym seanslarınızı başlatın, takip edin ve sonlandırın
        </p>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border flex items-center justify-between ${
              message.includes('başarı') || message.includes('güncellendi')
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.includes('başarı') || message.includes('güncellendi') ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                <XCircleIcon className="w-5 h-5" />
              )}
              {message}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessage}
            >
              ✕
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Status */}
      {girisYapildi && kullanici && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">
                Hoş geldiniz, {kullanici.ad}!
              </h3>
              <p className="text-green-700 text-sm">
                Kullanıcı ID: {kullanici.id} | Bakiye: ₺{kullanici.balance || 0}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Active Session Status */}
      {activeSession && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <PlayIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Aktif Seans Mevcut</h3>
              <p className="text-blue-700 text-sm">Şu anda devam eden bir seansınız var</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {JSON.stringify(activeSession, null, 2)}
            </pre>
          </div>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('start')}
            className={tabButtonClass(activeTab === 'start')}
          >
            <PlayIcon className="w-5 h-5 inline mr-2" />
            Seans Başlat
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={tabButtonClass(activeTab === 'active')}
          >
            <ClockIcon className="w-5 h-5 inline mr-2" />
            Aktif Seans
          </button>
          <button
            onClick={() => setActiveTab('end')}
            className={tabButtonClass(activeTab === 'end')}
          >
            <StopIcon className="w-5 h-5 inline mr-2" />
            Seans Bitir
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PlayIcon className="w-6 h-6 text-green-600" />
                Seans Başlat
              </h3>
              
              <form onSubmit={handleStartSession} className="space-y-4">
                <Input
                  label="Request ID"
                  type="number"
                  placeholder="Örn: 123"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  required
                  disabled={loading}
                  helperText="Onaylanmış katılma isteğinizin ID'sini girin"
                />
                
                <Button
                  type="submit"
                  variant="success"
                  loading={loading}
                  icon={<PlayIcon className="w-5 h-5" />}
                  fullWidth
                >
                  Seansı Başlat
                </Button>
              </form>
            </Card>
          </motion.div>
        )}

        {activeTab === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-blue-600" />
                Aktif Seans Sorgula
              </h3>
              
              <form onSubmit={handleCheckActiveSession} className="space-y-4">
                <Input
                  label="User ID"
                  type="number"
                  placeholder="Örn: 123"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={loading}
                  helperText={girisYapildi ? "Otomatik dolduruldu, değiştirebilirsiniz" : "Sorgulamak istediğiniz kullanıcının ID'sini girin"}
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={<ClockIcon className="w-5 h-5" />}
                  fullWidth
                >
                  Aktif Seansı Sorgula
                </Button>
              </form>

              {activeSession && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Aktif Seans Bilgileri:</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><strong>Seans ID:</strong> {activeSession.id}</div>
                    <div><strong>Kullanıcı ID:</strong> {activeSession.userId}</div>
                    <div><strong>Gym ID:</strong> {activeSession.gymId}</div>
                    <div><strong>Durum:</strong> {activeSession.status}</div>
                    {activeSession.startTime && (
                      <div><strong>Başlangıç:</strong> {new Date(activeSession.startTime).toLocaleString('tr-TR')}</div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === 'end' && (
          <motion.div
            key="end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <StopIcon className="w-6 h-6 text-red-600" />
                Seans Bitir
              </h3>
              
              <form onSubmit={handleEndSession} className="space-y-4">
                <Input
                  label="Session ID"
                  type="number"
                  placeholder="Örn: 123"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  required
                  disabled={loading}
                  helperText="Bitirmek istediğiniz seansın ID'sini girin"
                />
                
                <Button
                  type="submit"
                  variant="danger"
                  loading={loading}
                  icon={<StopIcon className="w-5 h-5" />}
                  fullWidth
                >
                  Seansı Bitir
                </Button>
              </form>

              {activeSession && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <ClockIcon className="w-5 h-5" />
                    <span className="font-medium">
                      Aktif seansınız var (ID: {activeSession.id})
                    </span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Bu ID'yi yukarıdaki forma girebilirsiniz.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <ClockIcon className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">
              Seans Yönetimi Hakkında
            </h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Seans başlatmak için onaylanmış bir katılma isteği gerekir</li>
              <li>• Aynı anda sadece bir aktif seansınız olabilir</li>
              <li>• Seansı bitirdikten sonra ödeme yapmanız gerekir</li>
              <li>• Aktif seans bilgilerinizi düzenli olarak kontrol edin</li>
              <li>• Seans süreniz otomatik olarak hesaplanır</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SessionManagement;