import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import useGymStore from '../../stores/useGymStore';
import useUserStore from '../../stores/useUserStore';
import api from '../../services/api';

const JoinRequests = () => {
  const [selectedGym, setSelectedGym] = useState('');
  const [requestId, setRequestId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manage'); // sadece 'manage'

  const { sporSalonlari, sporSalonlariniYukle } = useGymStore();
  const { kullanici, girisYapildi } = useUserStore();

  useEffect(() => {
    sporSalonlariniYukle();
  }, [sporSalonlariniYukle]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    
    if (!girisYapildi || !kullanici) {
      setMessage('Lütfen önce giriş yapın');
      return;
    }
    
    if (!selectedGym) {
      setMessage('Lütfen bir gym seçin');
      return;
    }

    setLoading(true);
    try {
      await api.joinRequest.sendJoinRequest({
        userId: kullanici.id,
        gymId: parseInt(selectedGym),
        message: 'Katılma isteği gönderildi'
      });
      setMessage('Katılma isteği başarıyla gönderildi!');
      setSelectedGym('');
    } catch (error) {
      console.error('Join request error:', error);
      setMessage('İstek gönderilirken hata oluştu: ' + api.utils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (e) => {
    e.preventDefault();
    
    if (!requestId) {
      setMessage('Lütfen rezervasyon numarası girin');
      return;
    }

    setLoading(true);
    try {
      await api.joinRequest.acceptJoinRequest(parseInt(requestId));
      setMessage('İstek başarıyla kabul edildi!');
      setRequestId('');
    } catch (error) {
      console.error('Accept request error:', error);
      setMessage('İstek kabul edilirken hata oluştu: ' + api.utils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (e) => {
    e.preventDefault();
    
    if (!requestId) {
      setMessage('Lütfen rezervasyon numarası girin');
      return;
    }

    setLoading(true);
    try {
      await api.joinRequest.rejectJoinRequest(parseInt(requestId));
      setMessage('İstek başarıyla reddedildi!');
      setRequestId('');
    } catch (error) {
      console.error('Reject request error:', error);
      setMessage('İstek reddedilirken hata oluştu: ' + api.utils.formatError(error));
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
          <UserGroupIcon className="w-8 h-8 text-blue-600" />
          Gym Katılma İstekleri
        </h2>
        <p className="text-gray-600 mt-1">
          Gym'lere katılma isteği gönderin veya gelen istekleri yönetin
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
              message.includes('başarı') 
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.includes('başarı') ? (
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

      {/* Tab Navigation - Sadece İstek Yönet */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className="px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 text-blue-600 border-blue-600 bg-blue-50"
          >
            <ClockIcon className="w-5 h-5 inline mr-2" />
            İstek Yönet
          </button>
        </nav>
      </div>

      {/* Tab Content - Sadece İstek Yönet */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            İstek Yönetimi
          </h3>
          <p className="text-gray-600 mb-6">
            Gelen katılma isteklerini kabul etmek veya reddetmek için rezervasyon numarasını girin.
          </p>

          <div className="space-y-4">
            <Input
              label="Rezervasyon Numarası"
              type="number"
              placeholder="Örn: 123"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
            />

            <div className="flex gap-3">
              <Button
                onClick={handleAcceptRequest}
                variant="success"
                loading={loading}
                disabled={!requestId}
                icon={<CheckCircleIcon className="w-5 h-5" />}
                fullWidth
              >
                Kabul Et
              </Button>
              
              <Button
                onClick={handleRejectRequest}
                variant="danger"
                loading={loading}
                disabled={!requestId}
                icon={<XCircleIcon className="w-5 h-5" />}
                fullWidth
              >
                Reddet
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <ClockIcon className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                İstek Yönetimi Hakkında
              </h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Rezervasyon numarasını istek gönderen kişiden alın</li>
                <li>• Kabul edilen istekler aktif hale gelir</li>
                <li>• Reddedilen istekler iptal edilir</li>
                <li>• İşlem geri alınamaz, dikkatli olun</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JoinRequests;