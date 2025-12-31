import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import useReservationStore from '../../stores/useReservationStore';
import useGymStore from '../../stores/useGymStore';
import { getEgitmenlerBySporSalonu } from '../../data/mockData';

const ReservationModal = () => {
  const {
    rezervasyonModalAcik,
    setRezervasyonModalAcik,
    rezervasyonFormu,
    setRezervasyonFormu,
    seciliRezervasyonTarihi,
    seciliRezervasyonSaati,
    musaitSaatler,
    setSeciliTarih,
    setSeciliSaat,
    musaitSaatleriYukle,
    rezervasyonOlustur,
    rezervasyonFormunuTemizle,
    yukleniyor
  } = useReservationStore();
  
  const { sporSalonlari } = useGymStore();
  
  const [adim, setAdim] = useState(1); // 1: Tarih/Saat, 2: Eğitmen, 3: Onay, 4: Başarı
  const [seciliEgitmen, setSeciliEgitmen] = useState(null);
  const [notlar, setNotlar] = useState('');
  const [rezervasyonSonucu, setRezervasyonSonucu] = useState(null);
  
  // Backend'den gelen gerçek gym bilgisini al
  const sporSalonu = sporSalonlari.find(gym => gym.id === rezervasyonFormu.sporSalonuId);
  
  // Eğitmenler için mock data kullan (backend'de eğitmen sistemi yok)
  const egitmenler = sporSalonu ? getEgitmenlerBySporSalonu(sporSalonu.id) : [];
  
  useEffect(() => {
    if (rezervasyonModalAcik && sporSalonu) {
      setAdim(1);
      setSeciliEgitmen(null);
      setNotlar('');
    }
  }, [rezervasyonModalAcik, sporSalonu]);
  
  const handleTarihSecimi = (tarih) => {
    setSeciliTarih(tarih);
    musaitSaatleriYukle(tarih, sporSalonu?.id, seciliEgitmen?.id);
  };
  
  const handleSaatSecimi = (saat) => {
    setSeciliSaat(saat);
  };
  
  const handleEgitmenSecimi = (egitmen) => {
    setSeciliEgitmen(egitmen);
    setRezervasyonFormu({ egitmenId: egitmen.id });
    
    // Eğitmen seçildiğinde müsait saatleri yeniden yükle
    if (seciliRezervasyonTarihi) {
      musaitSaatleriYukle(seciliRezervasyonTarihi, sporSalonu?.id, egitmen.id);
    }
  };
  
  const handleSonrakiAdim = () => {
    if (adim < 3) {
      setAdim(adim + 1);
    }
  };
  
  const handleOncekiAdim = () => {
    if (adim > 1) {
      setAdim(adim - 1);
    }
  };
  
  const handleRezervasyonOlustur = async () => {
    const rezervasyonVerisi = {
      sporSalonuId: sporSalonu.id,
      egitmenId: seciliEgitmen?.id,
      tarih: seciliRezervasyonTarihi,
      saat: seciliRezervasyonSaati,
      sure: 60,
      ucret: seciliEgitmen ? seciliEgitmen.saatlikUcret : sporSalonu.saatlikUcret,
      notlar: notlar
    };
    
    const sonuc = await rezervasyonOlustur(rezervasyonVerisi);
    
    if (sonuc.basarili) {
      setRezervasyonSonucu({
        rezervasyonId: sonuc.rezervasyonId,
        sporSalonuAdi: sporSalonu.ad,
        tarih: seciliRezervasyonTarihi,
        saat: seciliRezervasyonSaati,
        ucret: rezervasyonVerisi.ucret
      });
      setAdim(4); // Başarı adımına geç
    }
  };
  
  const handleModalKapat = () => {
    setRezervasyonModalAcik(false);
    rezervasyonFormunuTemizle();
    setAdim(1);
    setSeciliEgitmen(null);
    setNotlar('');
    setRezervasyonSonucu(null);
  };
  
  const getAdimBasligi = () => {
    switch (adim) {
      case 1: return 'Tarih ve Saat Seçimi';
      case 2: return 'Eğitmen Seçimi';
      case 3: return 'İstek Onayı';
      case 4: return 'İstek Gönderildi';
      default: return '';
    }
  };
  
  const adimTamamMi = () => {
    switch (adim) {
      case 1: return seciliRezervasyonTarihi && seciliRezervasyonSaati;
      case 2: return true; // Eğitmen seçimi opsiyonel
      case 3: return true;
      default: return false;
    }
  };
  
  if (!sporSalonu) return null;
  
  return (
    <Modal
      isOpen={rezervasyonModalAcik}
      onClose={handleModalKapat}
      title={`${sporSalonu.ad} - ${getAdimBasligi()}`}
      size="lg"
      footer={
        <div className="flex justify-between w-full">
          {adim === 4 ? (
            <Button
              variant="primary"
              onClick={handleModalKapat}
              className="w-full"
            >
              Tamam
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={adim === 1 ? handleModalKapat : handleOncekiAdim}
              >
                {adim === 1 ? 'İptal' : 'Geri'}
              </Button>
              
              <div className="flex gap-2">
                {adim < 3 ? (
                  <Button
                    variant="primary"
                    onClick={handleSonrakiAdim}
                    disabled={!adimTamamMi()}
                  >
                    Devam Et
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleRezervasyonOlustur}
                    loading={yukleniyor}
                    disabled={!adimTamamMi()}
                  >
                    Katılma İsteği Gönder
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Adım Göstergesi */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${stepNumber === adim 
                  ? 'bg-primary-600 text-white' 
                  : stepNumber < adim 
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }
              `}>
                {stepNumber < adim ? '✓' : stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`
                  w-12 h-0.5 mx-2
                  ${stepNumber < adim ? 'bg-green-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        {/* Adım İçerikleri */}
        <AnimatePresence mode="wait">
          {adim === 1 && (
            <TarihSaatSecimi
              sporSalonu={sporSalonu}
              seciliTarih={seciliRezervasyonTarihi}
              seciliSaat={seciliRezervasyonSaati}
              musaitSaatler={musaitSaatler}
              onTarihSecimi={handleTarihSecimi}
              onSaatSecimi={handleSaatSecimi}
              yukleniyor={yukleniyor}
            />
          )}
          
          {adim === 2 && (
            <EgitmenSecimi
              egitmenler={egitmenler}
              seciliEgitmen={seciliEgitmen}
              onEgitmenSecimi={handleEgitmenSecimi}
            />
          )}
          
          {adim === 3 && (
            <RezervasyonOnay
              sporSalonu={sporSalonu}
              seciliEgitmen={seciliEgitmen}
              tarih={seciliRezervasyonTarihi}
              saat={seciliRezervasyonSaati}
              notlar={notlar}
              onNotlarChange={setNotlar}
            />
          )}
          
          {adim === 4 && rezervasyonSonucu && (
            <RezervasyonBasarili
              rezervasyonSonucu={rezervasyonSonucu}
            />
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

// Tarih ve Saat Seçimi Bileşeni
const TarihSaatSecimi = ({ 
  sporSalonu, 
  seciliTarih, 
  seciliSaat, 
  musaitSaatler, 
  onTarihSecimi, 
  onSaatSecimi,
  yukleniyor 
}) => {
  const bugun = new Date();
  const gelecekHafta = new Date();
  gelecekHafta.setDate(bugun.getDate() + 7);
  
  const tarihSecenekleri = [];
  for (let i = 0; i < 7; i++) {
    const tarih = new Date();
    tarih.setDate(bugun.getDate() + i);
    tarihSecenekleri.push(tarih);
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Spor Salonu Bilgisi */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={sporSalonu.resim}
            alt={sporSalonu.ad}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{sporSalonu.ad}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              {sporSalonu.konum}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              {sporSalonu.acilisSaati} - {sporSalonu.kapanisSaati}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Tarih Seçimi */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Tarih Seçin</h4>
        <div className="grid grid-cols-7 gap-2">
          {tarihSecenekleri.map((tarih) => {
            const tarihStr = tarih.toISOString().split('T')[0];
            const gunAdi = tarih.toLocaleDateString('tr-TR', { weekday: 'short' });
            const gunSayisi = tarih.getDate();
            
            return (
              <button
                key={tarihStr}
                onClick={() => onTarihSecimi(tarihStr)}
                className={`
                  p-3 rounded-lg border text-center transition-colors
                  ${seciliTarih === tarihStr
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-900 border-gray-200 hover:border-primary-300'
                  }
                `}
              >
                <div className="text-xs font-medium">{gunAdi}</div>
                <div className="text-lg font-bold">{gunSayisi}</div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Saat Seçimi */}
      {seciliTarih && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Saat Seçin</h4>
          {yukleniyor ? (
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {musaitSaatler.map((saat) => (
                <button
                  key={saat}
                  onClick={() => onSaatSecimi(saat)}
                  className={`
                    p-3 rounded-lg border text-center transition-colors
                    ${seciliSaat === saat
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-primary-300'
                    }
                  `}
                >
                  {saat}
                </button>
              ))}
            </div>
          )}
          
          {!yukleniyor && musaitSaatler.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Bu tarih için müsait saat bulunmamaktadır.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Eğitmen Seçimi Bileşeni
const EgitmenSecimi = ({ egitmenler, seciliEgitmen, onEgitmenSecimi }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <p className="text-gray-600">
          İsterseniz bir eğitmen seçebilirsiniz (opsiyonel)
        </p>
      </div>
      
      {/* Eğitmensiz Seçenek */}
      <Card
        className={`p-4 cursor-pointer transition-colors ${
          !seciliEgitmen ? 'ring-2 ring-primary-600 bg-primary-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => onEgitmenSecimi(null)}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900">Eğitmensiz</h3>
          <p className="text-sm text-gray-600">Kendi başınıza antrenman yapın</p>
        </div>
      </Card>
      
      {/* Eğitmen Listesi */}
      <div className="grid gap-4">
        {egitmenler.map((egitmen) => (
          <Card
            key={egitmen.id}
            className={`p-4 cursor-pointer transition-colors ${
              seciliEgitmen?.id === egitmen.id 
                ? 'ring-2 ring-primary-600 bg-primary-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onEgitmenSecimi(egitmen)}
          >
            <div className="flex items-center gap-4">
              <img
                src={egitmen.resim}
                alt={egitmen.ad}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{egitmen.ad}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  {egitmen.uzmanlik.join(', ')}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{egitmen.deneyim} yıl deneyim</span>
                  <span className="flex items-center gap-1">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    ₺{egitmen.saatlikUcret}/saat
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

// Rezervasyon Onay Bileşeni
const RezervasyonOnay = ({ 
  sporSalonu, 
  seciliEgitmen, 
  tarih, 
  saat, 
  notlar, 
  onNotlarChange 
}) => {
  const toplamUcret = seciliEgitmen ? seciliEgitmen.saatlikUcret : sporSalonu.saatlikUcret;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Rezervasyon Özeti */}
      <Card className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Rezervasyon Özeti</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Spor Salonu:</span>
            <span className="font-medium">{sporSalonu.ad}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tarih:</span>
            <span className="font-medium">
              {new Date(tarih).toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Saat:</span>
            <span className="font-medium">{saat}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Süre:</span>
            <span className="font-medium">60 dakika</span>
          </div>
          
          {seciliEgitmen && (
            <div className="flex justify-between">
              <span className="text-gray-600">Eğitmen:</span>
              <span className="font-medium">{seciliEgitmen.ad}</span>
            </div>
          )}
          
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Toplam Ücret:</span>
              <span className="text-primary-600">₺{toplamUcret}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Notlar */}
      <div>
        <Input
          label="Notlar (Opsiyonel)"
          placeholder="Özel isteklerinizi buraya yazabilirsiniz..."
          value={notlar}
          onChange={(e) => onNotlarChange(e.target.value)}
          rows={3}
          multiline
        />
      </div>
    </motion.div>
  );
};

// Rezervasyon Başarılı Bileşeni
const RezervasyonBasarili = ({ rezervasyonSonucu }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center space-y-6"
    >
      {/* Başarı İkonu */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </div>
      </div>
      
      {/* Başarı Mesajı */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Katılma İsteğiniz Gönderildi!
        </h3>
        <p className="text-gray-600">
          Spor salonuna katılma isteğiniz başarıyla gönderildi. Onay bekliyor.
        </p>
      </div>
      
      {/* Rezervasyon Detayları */}
      <Card className="p-6 text-left">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Rezervasyon Numarası:</span>
            <span className="font-mono font-semibold text-primary-600">
              #{rezervasyonSonucu.rezervasyonId}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Spor Salonu:</span>
            <span className="font-medium">{rezervasyonSonucu.sporSalonuAdi}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tarih:</span>
            <span className="font-medium">
              {new Date(rezervasyonSonucu.tarih).toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Saat:</span>
            <span className="font-medium">{rezervasyonSonucu.saat}</span>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Toplam Ücret:</span>
              <span className="text-primary-600">₺{rezervasyonSonucu.ucret}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Bilgi Notu */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Not:</strong> Katılma isteğiniz spor salonu yöneticisine iletilmiştir.
          Onay durumu hakkında email ile bilgilendirileceksiniz. İsteğinizi "Katılma İstekleri"
          bölümünden takip edebilirsiniz.
        </p>
      </div>
    </motion.div>
  );
};

export default ReservationModal;