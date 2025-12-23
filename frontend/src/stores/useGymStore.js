import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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
          // Gerçek API çağrısı simülasyonu
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ 
            sporSalonlari: sporSalonlari,
            filtrelenmisSpor: sporSalonlari,
            yukleniyor: false 
          });
        } catch (error) {
          set({ 
            hata: 'Spor salonları yüklenirken bir hata oluştu',
            yukleniyor: false 
          });
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