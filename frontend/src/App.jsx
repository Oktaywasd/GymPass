import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

// Components
import MasonryGrid from './components/gym/MasonryGrid';
import ReservationModal from './components/reservation/ReservationModal';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Card from './components/ui/Card';

// Stores
import useGymStore from './stores/useGymStore';
import useReservationStore from './stores/useReservationStore';
import useUserStore from './stores/useUserStore';

// Data
import { getSporSalonuById } from './data/mockData';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  
  const {
    filtrelenmisSpor,
    aramaMetni,
    setAramaMetni,
    filtreler,
    setFiltreler,
    siralama,
    setSiralama,
    sporSalonlariniYukle,
    sporSalonuDetayiniYukle,
    yukleniyor
  } = useGymStore();
  
  const { setRezervasyonModalAcik, setRezervasyonFormu } = useReservationStore();
  const { kullanici, girisYapildi } = useUserStore();
  
  // Uygulama başlatıldığında spor salonlarını yükle
  useEffect(() => {
    sporSalonlariniYukle();
  }, [sporSalonlariniYukle]);
  
  const handleCardClick = (sporSalonu) => {
    sporSalonuDetayiniYukle(sporSalonu.id);
    // Detay sayfasına yönlendirme burada yapılacak
    console.log('Spor salonu detayı:', sporSalonu);
  };
  
  const handleQuickSearch = (e) => {
    setAramaMetni(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <h1 className="text-2xl font-bold text-blue-600">
                  GymPass
                </h1>
              </motion.div>
            </div>
            
            {/* Arama Çubuğu - Desktop */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <Input
                placeholder="Spor salonu, konum veya aktivite ara..."
                value={aramaMetni}
                onChange={handleQuickSearch}
                icon={<MagnifyingGlassIcon className="w-5 h-5" />}
                iconPosition="left"
              />
            </div>
            
            {/* Sağ Menü */}
            <div className="flex items-center gap-4">
              {/* Filtre Butonu */}
              <Button
                variant="ghost"
                size="sm"
                icon={<AdjustmentsHorizontalIcon className="w-5 h-5" />}
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                className="hidden md:flex"
              >
                Filtreler
              </Button>
              
              {/* Kullanıcı Menüsü */}
              {girisYapildi ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 hidden sm:block">
                    Merhaba, {kullanici?.ad || 'Kullanıcı'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<UserCircleIcon className="w-6 h-6" />}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Giriş Yap
                  </Button>
                  <Button variant="primary" size="sm">
                    Kayıt Ol
                  </Button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                icon={<Bars3Icon className="w-6 h-6" />}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              />
            </div>
          </div>
          
          {/* Mobile Arama */}
          <div className="md:hidden pb-4">
            <Input
              placeholder="Spor salonu, konum veya aktivite ara..."
              value={aramaMetni}
              onChange={handleQuickSearch}
              icon={<MagnifyingGlassIcon className="w-5 h-5" />}
              iconPosition="left"
            />
          </div>
        </div>
      </header>
      
      {/* Ana İçerik */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filtre Paneli - Desktop */}
          <aside className={`
            w-80 flex-shrink-0 hidden lg:block
            ${filterPanelOpen ? 'block' : 'hidden'}
          `}>
            <FilterPanel />
          </aside>
          
          {/* Grid İçeriği */}
          <div className="flex-1">
            {/* Sonuç Başlığı */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Spor Salonları
                </h2>
                <p className="text-gray-600 mt-1">
                  {filtrelenmisSpor.length} sonuç bulundu
                </p>
              </div>
              
              {/* Sıralama */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sırala:</span>
                <select
                  value={siralama}
                  onChange={(e) => setSiralama(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="puan-desc">En Yüksek Puan</option>
                  <option value="puan-asc">En Düşük Puan</option>
                  <option value="ucret-asc">En Uygun Fiyat</option>
                  <option value="ucret-desc">En Yüksek Fiyat</option>
                  <option value="yorum-desc">En Çok Yorumlanan</option>
                </select>
              </div>
            </div>
            
            {/* Masonry Grid */}
            <MasonryGrid onCardClick={handleCardClick} />
          </div>
        </div>
      </main>
      
      {/* Rezervasyon Modal */}
      <ReservationModal />
      
      {/* Mobile Filtre Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filtreler</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ✕
                </Button>
              </div>
              <FilterPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Filtre Paneli Bileşeni
const FilterPanel = () => {
  const { filtreler, setFiltreler, filtreleriTemizle } = useGymStore();
  
  const ozellikSecenekleri = [
    'Kardio', 'Ağırlık', 'Grup Dersleri', 'Sauna', 'CrossFit', 
    'Yoga', 'Pilates', 'Yüzme', 'Boks', 'HIIT'
  ];
  
  const handleOzellikToggle = (ozellik) => {
    const mevcutOzellikler = filtreler.ozellikler || [];
    const yeniOzellikler = mevcutOzellikler.includes(ozellik)
      ? mevcutOzellikler.filter(o => o !== ozellik)
      : [...mevcutOzellikler, ozellik];
    
    setFiltreler({ ozellikler: yeniOzellikler });
  };
  
  return (
    <Card className="p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={filtreleriTemizle}
          className="text-primary-600"
        >
          Temizle
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Konum Filtresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konum
          </label>
          <Input
            placeholder="Şehir veya ilçe"
            value={filtreler.konum || ''}
            onChange={(e) => setFiltreler({ konum: e.target.value })}
          />
        </div>
        
        {/* Fiyat Aralığı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maksimum Fiyat (₺/saat)
          </label>
          <Input
            type="range"
            min="0"
            max="200"
            value={filtreler.maxUcret || 200}
            onChange={(e) => setFiltreler({ maxUcret: parseInt(e.target.value) })}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>₺0</span>
            <span>₺{filtreler.maxUcret || 200}</span>
          </div>
        </div>
        
        {/* Minimum Puan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Puan
          </label>
          <select
            value={filtreler.minPuan || 0}
            onChange={(e) => setFiltreler({ minPuan: parseFloat(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Tümü</option>
            <option value={3}>3+ Yıldız</option>
            <option value={4}>4+ Yıldız</option>
            <option value={4.5}>4.5+ Yıldız</option>
          </select>
        </div>
        
        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            value={filtreler.kategori || ''}
            onChange={(e) => setFiltreler({ kategori: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tümü</option>
            <option value="premium">Premium</option>
            <option value="standart">Standart</option>
          </select>
        </div>
        
        {/* Özellikler */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Özellikler
          </label>
          <div className="space-y-2">
            {ozellikSecenekleri.map((ozellik) => (
              <label key={ozellik} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(filtreler.ozellikler || []).includes(ozellik)}
                  onChange={() => handleOzellikToggle(ozellik)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{ozellik}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Müsaitlik */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Müsaitlik
          </label>
          <select
            value={filtreler.musaitlik || ''}
            onChange={(e) => setFiltreler({ musaitlik: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tümü</option>
            <option value="yuksek">Müsait</option>
            <option value="orta">Kısıtlı</option>
            <option value="dusuk">Dolu</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

export default App;
