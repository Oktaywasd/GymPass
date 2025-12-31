import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';
import {
  sporSalonlari,
  egitmenler,
  filterSporSalonlari,
  siralaSporSalonlari,
  getSporSalonuById,
  getEgitmenlerBySporSalonu
} from '../data/mockData';

const useGymStore = create(
  devtools(
    (set, get) => ({
      // State
      sporSalonlari: sporSalonlari,
      filtrelenmisSpor: sporSalonlari,
      egitmenler: egitmenler,
      seciliSporSalonu: null,
      seciliEgitmen: null,
      yukleniyor: false,
      hata: null,
      
      // Filtreleme ve sıralama
      filtreler: {
        konum: '',
        minPuan: 0,
        maxUcret: 1000,
        ozellikler: [],
        kategori: '',
        musaitlik: ''
      },
      siralama: 'puan-desc',
      
      // Arama
      aramaMetni: '',
      
      // Actions
      setSporSalonlari: (salonlar) => set({ sporSalonlari: salonlar }),
      
      setSeciliSporSalonu: (salonId) => {
        const salon = getSporSalonuById(salonId);
        set({ seciliSporSalonu: salon });
      },
      
      setSeciliEgitmen: (egitmenId) => {
        const egitmen = egitmenler.find(e => e.id === egitmenId);
        set({ seciliEgitmen: egitmen });
      },
      
      setFiltreler: (yeniFiltreler) => {
        const guncelFiltreler = { ...get().filtreler, ...yeniFiltreler };
        set({ filtreler: guncelFiltreler });
        get().filtreleriUygula();
      },
      
      setSiralama: (yeniSiralama) => {
        set({ siralama: yeniSiralama });
        get().filtreleriUygula();
      },
      
      setAramaMetni: (metin) => {
        set({ aramaMetni: metin });
        get().filtreleriUygula();
      },
      
      filtreleriUygula: () => {
        const { sporSalonlari, filtreler, siralama, aramaMetni } = get();
        let sonuc = [...sporSalonlari];
        
        // Arama filtresi
        if (aramaMetni) {
          sonuc = sonuc.filter(salon =>
            salon.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
            salon.konum.toLowerCase().includes(aramaMetni.toLowerCase()) ||
            salon.aciklama.toLowerCase().includes(aramaMetni.toLowerCase()) ||
            salon.ozellikler.some(ozellik => 
              ozellik.toLowerCase().includes(aramaMetni.toLowerCase())
            )
          );
        }
        
        // Diğer filtreler
        sonuc = filterSporSalonlari(filtreler, sonuc);
        
        // Sıralama
        sonuc = siralaSporSalonlari(sonuc, siralama);
        
        set({ filtrelenmisSpor: sonuc });
      },
      
      filtreleriTemizle: () => {
        const varsayilanFiltreler = {
          konum: '',
          minPuan: 0,
          maxUcret: 1000,
          ozellikler: [],
          kategori: '',
          musaitlik: ''
        };
        set({ 
          filtreler: varsayilanFiltreler,
          aramaMetni: '',
          siralama: 'puan-desc'
        });
        get().filtreleriUygula();
      },
      
      // Async actions
      sporSalonlariniYukle: async () => {
        set({ yukleniyor: true, hata: null });
        try {
          // Backend durumunu kontrol et
          const isBackendOnline = await api.utils.isBackendOnline();
          
          if (isBackendOnline) {
            // Backend online - sadece backend data'sını kullan
            const backendGyms = await api.gym.getAllGyms();
            
            // Rastgele gym görselleri
            const gymImages = [
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=300&fit=crop"
            ];

            // Backend verilerini frontend formatına çevir
            const formattedGyms = backendGyms.map((gym, index) => ({
              id: gym.id,
              ad: gym.name,
              aciklama: `${gym.name} - ${gym.location}`,
              resim: gymImages[index % gymImages.length], // Rastgele görsel seç
              konum: gym.location,
              puan: Math.round((4.0 + Math.random() * 1) * 10) / 10, // 4.0-5.0 arası, 1 ondalık basamak
              yorumSayisi: Math.floor(Math.random() * 100), // 0-99 arası rastgele yorum sayısı
              saatlikUcret: Math.round(gym.pricePerMinute * 60), // Dakika -> Saat
              ozellikler: ["Kardio", "Ağırlık", "Grup Dersleri"], // Default değerler
              acilisSaati: "06:00",
              kapanisSaati: "23:00",
              musaitlik: "yuksek",
              kategori: "standart",
              telefon: "+90 212 555 0000",
              adres: gym.location,
              sosyalMedya: {
                instagram: "@gym_" + gym.id,
                facebook: "Gym" + gym.id
              }
            }));

            set({
              sporSalonlari: formattedGyms,
              filtrelenmisSpor: formattedGyms,
              yukleniyor: false,
              hata: null
            });
          } else {
            // Backend offline - sadece mock data'sını kullan
            console.log('Backend offline, using mock data only');
            set({
              sporSalonlari: sporSalonlari,
              filtrelenmisSpor: sporSalonlari,
              hata: 'Backend offline - demo veriler gösteriliyor',
              yukleniyor: false
            });
          }
        } catch (error) {
          console.error('Gym yükleme hatası:', error);
          // Hata durumunda mock data'yı kullan
          set({
            sporSalonlari: sporSalonlari,
            filtrelenmisSpor: sporSalonlari,
            hata: 'Veri yükleme hatası - demo veriler gösteriliyor',
            yukleniyor: false
          });
        }
      },

      // Yeni gym oluştur
      gymOlustur: async (gymData) => {
        set({ yukleniyor: true, hata: null });
        try {
          const yeniGym = await api.gym.createGym(gymData);
          
          // Store'u güncelle
          await get().sporSalonlariniYukle();
          
          return { basarili: true, gym: yeniGym };
        } catch (error) {
          const hataMessaji = api.utils.formatError(error);
          set({
            hata: hataMessaji,
            yukleniyor: false
          });
          return { basarili: false, hata: hataMessaji };
        }
      },
      
      sporSalonuDetayiniYukle: async (salonId) => {
        set({ yukleniyor: true, hata: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const salon = getSporSalonuById(salonId);
          const salonEgitmenleri = getEgitmenlerBySporSalonu(salonId);
          
          if (salon) {
            set({ 
              seciliSporSalonu: { ...salon, egitmenler: salonEgitmenleri },
              yukleniyor: false 
            });
          } else {
            set({ 
              hata: 'Spor salonu bulunamadı',
              yukleniyor: false 
            });
          }
        } catch (error) {
          set({ 
            hata: 'Spor salonu detayları yüklenirken bir hata oluştu',
            yukleniyor: false 
          });
        }
      }
    }),
    {
      name: 'gym-store',
      partialize: (state) => ({
        filtreler: state.filtreler,
        siralama: state.siralama
      })
    }
  )
);

export default useGymStore;