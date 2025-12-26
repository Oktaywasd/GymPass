import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GridCard from './GridCard';
import useGymStore from '../../stores/useGymStore';

const MasonryGrid = ({ onCardClick }) => {
  const { filtrelenmisSpor, yukleniyor } = useGymStore();
  const [columns, setColumns] = useState(3);
  const gridRef = useRef(null);
  
  // Responsive sütun sayısı
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 768) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };
    
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);
  
  // Sütunlara kartları dağıt
  const distributeCards = () => {
    const columnArrays = Array.from({ length: columns }, () => []);
    
    filtrelenmisSpor.forEach((salon, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(salon);
    });
    
    return columnArrays;
  };
  
  const columnArrays = distributeCards();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const columnVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  if (yukleniyor) {
    return <MasonryGridSkeleton columns={columns} />;
  }
  
  if (filtrelenmisSpor.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <motion.div
      ref={gridRef}
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={`
        grid gap-4
        ${columns === 1 ? 'grid-cols-1' : ''}
        ${columns === 2 ? 'grid-cols-2' : ''}
        ${columns === 3 ? 'grid-cols-3' : ''}
      `}>
        <AnimatePresence>
          {columnArrays.map((columnCards, columnIndex) => (
            <motion.div
              key={columnIndex}
              className="flex flex-col gap-4"
              variants={columnVariants}
            >
              {columnCards.map((salon) => (
                <GridCard
                  key={salon.id}
                  sporSalonu={salon}
                  onCardClick={onCardClick}
                />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Skeleton loader bileşeni
const MasonryGridSkeleton = ({ columns }) => {
  const skeletonItems = Array.from({ length: 12 }, (_, i) => i);
  const columnArrays = Array.from({ length: columns }, () => []);
  
  skeletonItems.forEach((item, index) => {
    const columnIndex = index % columns;
    columnArrays[columnIndex].push(item);
  });
  
  return (
    <div className={`
      grid gap-4
      ${columns === 1 ? 'grid-cols-1' : ''}
      ${columns === 2 ? 'grid-cols-2' : ''}
      ${columns === 3 ? 'grid-cols-3' : ''}
    `}>
      {columnArrays.map((columnItems, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {columnItems.map((item) => (
            <SkeletonCard key={item} />
          ))}
        </div>
      ))}
    </div>
  );
};

const SkeletonCard = () => {
  const randomHeight = Math.floor(Math.random() * 100) + 300; // 300-400px arası
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Resim alanı */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      {/* İçerik alanı */}
      <div className="p-4">
        {/* Başlık */}
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        
        {/* Konum */}
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
        
        {/* Açıklama */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        {/* Özellikler */}
        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>
        
        {/* Alt bilgiler */}
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

// Boş durum bileşeni
const EmptyState = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Spor Salonu Bulunamadı
      </h3>
      
      <p className="text-gray-600 text-center max-w-md mb-6">
        Aradığınız kriterlere uygun spor salonu bulunamadı. 
        Filtreleri değiştirerek tekrar deneyebilirsiniz.
      </p>
      
      <motion.button
        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const { filtreleriTemizle } = useGymStore.getState();
          filtreleriTemizle();
        }}
      >
        Filtreleri Temizle
      </motion.button>
    </motion.div>
  );
};

export default MasonryGrid;