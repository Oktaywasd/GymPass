import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  BuildingStorefrontIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import useGymStore from '../../stores/useGymStore';
import useUserStore from '../../stores/useUserStore';

const GymManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGym, setNewGym] = useState({
    name: '',
    location: '',
    pricePerMinute: ''
  });
  const [message, setMessage] = useState('');

  const { 
    sporSalonlari, 
    yukleniyor, 
    hata, 
    sporSalonlariniYukle, 
    gymOlustur 
  } = useGymStore();
  
  const { kullanici, girisYapildi } = useUserStore();

  useEffect(() => {
    sporSalonlariniYukle();
  }, [sporSalonlariniYukle]);

  const handleCreateGym = async (e) => {
    e.preventDefault();
    
    if (!girisYapildi) {
      setMessage('Gym oluşturmak için giriş yapmanız gerekiyor');
      return;
    }

    const result = await gymOlustur({
      name: newGym.name,
      location: newGym.location,
      pricePerMinute: parseFloat(newGym.pricePerMinute)
    });

    if (result.basarili) {
      setMessage('Gym başarıyla oluşturuldu!');
      setNewGym({ name: '', location: '', pricePerMinute: '' });
      setShowCreateModal(false);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.hata || 'Gym oluşturulurken hata oluştu');
    }
  };

  const handleInputChange = (field, value) => {
    setNewGym(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearMessage = () => setMessage('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BuildingStorefrontIcon className="w-8 h-8 text-blue-600" />
            Gym Yönetimi
          </h2>
          <p className="text-gray-600 mt-1">
            Gym'leri görüntüleyin ve yeni gym oluşturun
          </p>
        </div>
        
        {girisYapildi && (
          <Button
            variant="primary"
            icon={<PlusIcon className="w-5 h-5" />}
            onClick={() => setShowCreateModal(true)}
            disabled={yukleniyor}
          >
            Yeni Gym Oluştur
          </Button>
        )}
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

        {hata && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg border bg-yellow-50 border-yellow-200 text-yellow-800"
          >
            <div className="flex items-center gap-2">
              <XCircleIcon className="w-5 h-5" />
              {hata}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Status */}
      {!girisYapildi && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="text-center">
            <BuildingStorefrontIcon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Gym Oluşturmak İçin Giriş Yapın
            </h3>
            <p className="text-blue-700">
              Yeni gym oluşturabilmek için önce hesabınıza giriş yapmanız gerekiyor.
            </p>
          </div>
        </Card>
      )}

      {/* Gym List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Mevcut Gym'ler ({sporSalonlari.length})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={sporSalonlariniYukle}
            disabled={yukleniyor}
          >
            {yukleniyor ? 'Yükleniyor...' : 'Yenile'}
          </Button>
        </div>

        {yukleniyor ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : sporSalonlari.length === 0 ? (
          <Card className="p-12 text-center">
            <BuildingStorefrontIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Henüz Gym Bulunmuyor
            </h3>
            <p className="text-gray-600 mb-4">
              İlk gym'i oluşturmak için yukarıdaki butonu kullanın.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {sporSalonlari.map((gym, index) => (
                <motion.div
                  key={gym.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {gym.ad}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPinIcon className="w-4 h-4" />
                          {gym.konum}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        ₺{gym.saatlikUcret}/saat
                      </div>
                      
                      {gym.ozellikler && gym.ozellikler.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {gym.ozellikler.slice(0, 3).map((ozellik, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {ozellik}
                            </span>
                          ))}
                          {gym.ozellikler.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{gym.ozellikler.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        ID: {gym.id}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Gym Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Yeni Gym Oluştur"
        size="md"
      >
        <form onSubmit={handleCreateGym} className="space-y-4">
          <Input
            label="Gym Adı"
            placeholder="Örn: FitLife Spor Merkezi"
            value={newGym.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
          
          <Input
            label="Konum"
            placeholder="Örn: Beşiktaş, İstanbul"
            value={newGym.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            required
          />
          
          <Input
            label="Dakika Başı Fiyat (₺)"
            type="number"
            step="0.01"
            min="0"
            placeholder="Örn: 0.75"
            value={newGym.pricePerMinute}
            onChange={(e) => handleInputChange('pricePerMinute', e.target.value)}
            required
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              fullWidth
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={yukleniyor}
              fullWidth
            >
              Oluştur
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GymManagement;