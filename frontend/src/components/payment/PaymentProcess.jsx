import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import useUserStore from '../../stores/useUserStore';
import api from '../../services/api';

const PaymentProcess = () => {
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [userPayments, setUserPayments] = useState([]);

  const { kullanici, girisYapildi } = useUserStore();

  useEffect(() => {
    if (girisYapildi && kullanici) {
      loadUserPayments();
    }
  }, [girisYapildi, kullanici]);

  const loadUserPayments = async () => {
    try {
      const payments = await api.payment.getUserPayments(kullanici.id);
      setUserPayments(payments);
    } catch (error) {
      console.error('User payments yükleme hatası:', error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!girisYapildi || !kullanici) {
      setMessage('Ödeme yapmak için giriş yapmanız gerekiyor');
      return;
    }
    
    if (!sessionId) {
      setMessage('Lütfen session ID girin');
      return;
    }

    setLoading(true);
    try {
      const result = await api.payment.makePayment(parseInt(sessionId));
      setMessage('Ödeme başarıyla tamamlandı!');
      
      // Local payment history'ye ekle
      const newPayment = {
        id: Date.now(),
        sessionId: parseInt(sessionId),
        amount: result.amount || 'Bilinmiyor',
        timestamp: new Date().toLocaleString('tr-TR'),
        status: 'Başarılı',
        paymentId: result.id
      };
      setPaymentHistory(prev => [newPayment, ...prev]);
      
      // User payments'ı yenile
      await loadUserPayments();
      
      setSessionId('');
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('Ödeme işlemi başarısız: ' + api.utils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setPaymentHistory([]);
    setMessage('Yerel ödeme geçmişi temizlendi');
  };

  const clearMessage = () => setMessage('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCardIcon className="w-8 h-8 text-blue-600" />
          Ödeme İşlemleri
        </h2>
        <p className="text-gray-600 mt-1">
          Gym seanslarınız için ödeme yapın ve geçmişinizi görüntüleyin
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
              message.includes('başarı') || message.includes('tamamlandı')
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.includes('başarı') || message.includes('tamamlandı') ? (
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
      {!girisYapildi ? (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <CreditCardIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Ödeme Yapmak İçin Giriş Yapın
            </h3>
            <p className="text-yellow-700">
              Ödeme işlemleri için önce hesabınıza giriş yapmanız gerekiyor.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">
                Hoş geldiniz, {kullanici.ad}!
              </h3>
              <p className="text-green-700 text-sm">
                Bakiye: ₺{kullanici.balance || 0} | Kullanıcı ID: {kullanici.id}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCardIcon className="w-6 h-6 text-blue-600" />
          Seans Ödemesi
        </h3>
        <p className="text-gray-600 mb-6">
          Tamamlanan gym seansınız için ödeme yapın.
        </p>

        <form onSubmit={handlePayment} className="space-y-4">
          <Input
            label="Session ID"
            type="number"
            placeholder="Örn: 123"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            required
            disabled={loading || !girisYapildi}
            helperText="Ödeme yapmak istediğiniz seansın ID'sini girin"
          />
          
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!girisYapildi}
            icon={<CreditCardIcon className="w-5 h-5" />}
            fullWidth
          >
            {loading ? 'Ödeme İşleniyor...' : 'Ödeme Yap'}
          </Button>
        </form>
      </Card>

      {/* Recent Local Payments */}
      {paymentHistory.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ClockIcon className="w-6 h-6 text-blue-600" />
              Son Ödemeler (Yerel)
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
            >
              Temizle
            </Button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {paymentHistory.map(payment => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      Session #{payment.sessionId}
                    </div>
                    <div className="text-sm text-gray-600">
                      {payment.timestamp}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-medium flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      {payment.status}
                    </div>
                    {payment.amount !== 'Bilinmiyor' && (
                      <div className="text-sm text-gray-600">
                        ₺{payment.amount}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Backend Payment History */}
      {girisYapildi && userPayments.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            Ödeme Geçmişi (Backend)
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {userPayments.map(payment => (
              <div
                key={payment.id}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      Payment #{payment.id}
                    </div>
                    <div className="text-sm text-gray-600">
                      Session: {payment.sessionId || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900">
                        ₺{payment.amount || 'N/A'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {payment.status || 'Completed'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <CreditCardIcon className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">
              Ödeme Hakkında Bilgiler
            </h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Ödeme yapmadan önce seansınızın tamamlandığından emin olun</li>
              <li>• Session ID'yi "Rezervasyonlar" bölümünden öğrenebilirsiniz</li>
              <li>• Ödeme tutarı seansın süresine göre otomatik hesaplanır</li>
              <li>• Başarılı ödemeler anında işleme alınır</li>
              <li>• Ödeme geçmişinizi bu sayfadan takip edebilirsiniz</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentProcess;