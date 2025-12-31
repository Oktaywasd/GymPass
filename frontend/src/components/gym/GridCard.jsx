import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  MapPinIcon, 
  ClockIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useReservationStore from '../../stores/useReservationStore';

const GridCard = ({ sporSalonu, onCardClick, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const { setRezervasyonModalAcik, setRezervasyonFormu } = useReservationStore();
  
  // Müsaitlik durumuna göre renk belirleme
  const getMusaitlikRengi = (musaitlik) => {
    switch (musaitlik) {
      case 'yuksek': return 'bg-green-500';
      case 'orta': return 'bg-yellow-500';
      case 'dusuk': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getMusaitlikMetni = (musaitlik) => {
    switch (musaitlik) {
      case 'yuksek': return 'Müsait';
      case 'orta': return 'Kısıtlı';
      case 'dusuk': return 'Dolu';
      default: return 'Bilinmiyor';
    }
  };
  
  const handleQuickReservation = (e) => {
    e.stopPropagation();
    setRezervasyonFormu({
      sporSalonuId: sporSalonu.id,
      egitmenId: null
    });
    setRezervasyonModalAcik(true);
  };
  
  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };
  
  const handleShare = (e) => {
    e.stopPropagation();
    // Paylaşım fonksiyonalitesi
    if (navigator.share) {
      navigator.share({
        title: sporSalonu.ad,
        text: sporSalonu.aciklama,
        url: window.location.href
      });
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -8,
      transition: { duration: 0.2 }
    }
  };
  
  const imageVariants = {
    loading: { opacity: 0 },
    loaded: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const quickActionsVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`masonry-item ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setShowQuickActions(true)}
      onHoverEnd={() => setShowQuickActions(false)}
    >
      <Card 
        className="overflow-hidden cursor-pointer group"
        onClick={() => onCardClick(sporSalonu)}
        padding="none"
        hover={true}
      >
        {/* Resim Alanı */}
        <div className="relative overflow-hidden">
          {!imageLoaded && (
            <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
          )}
          
          <motion.img
            src={sporSalonu.resim}
            alt={sporSalonu.ad}
            className={`w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 ${
              imageLoaded ? 'block' : 'hidden'
            }`}
            variants={imageVariants}
            initial="loading"
            animate={imageLoaded ? "loaded" : "loading"}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay Gradyanı */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Üst Sağ Aksiyonlar */}
          <div className="absolute top-3 right-3 flex gap-2">
            <motion.button
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              onClick={handleFavoriteToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFavorited ? (
                <HeartSolidIcon className="w-4 h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-4 h-4 text-gray-600" />
              )}
            </motion.button>
            
            <motion.button
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              onClick={handleShare}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShareIcon className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>
          
          {/* Müsaitlik Durumu */}
          <div className="absolute top-3 left-3">
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium text-white
              ${getMusaitlikRengi(sporSalonu.musaitlik)}
            `}>
              {getMusaitlikMetni(sporSalonu.musaitlik)}
            </div>
          </div>
          
          {/* Hızlı Aksiyonlar */}
          <motion.div
            className="absolute bottom-3 left-3 right-3"
            variants={quickActionsVariants}
            initial="hidden"
            animate={showQuickActions ? "visible" : "hidden"}
          >
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleQuickReservation}
              icon={<CalendarIcon className="w-4 h-4" />}
            >
              Katılma İsteği
            </Button>
          </motion.div>
        </div>
        
        {/* İçerik Alanı */}
        <div className="p-4">
          {/* Başlık ve Puan */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
              {sporSalonu.ad}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {sporSalonu.puan}
              </span>
              <span className="text-xs text-gray-500">
                ({sporSalonu.yorumSayisi})
              </span>
            </div>
          </div>
          
          {/* Konum */}
          <div className="flex items-center gap-1 mb-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{sporSalonu.konum}</span>
          </div>
          
          {/* Açıklama */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {sporSalonu.aciklama}
          </p>
          
          {/* Özellikler */}
          <div className="flex flex-wrap gap-1 mb-3">
            {sporSalonu.ozellikler.slice(0, 3).map((ozellik, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {ozellik}
              </span>
            ))}
            {sporSalonu.ozellikler.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{sporSalonu.ozellikler.length - 3}
              </span>
            )}
          </div>
          
          {/* Alt Bilgiler */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {sporSalonu.acilisSaati} - {sporSalonu.kapanisSaati}
              </span>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-primary-600">
                ₺{sporSalonu.saatlikUcret}
              </div>
              <div className="text-xs text-gray-500">saatlik</div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GridCard;