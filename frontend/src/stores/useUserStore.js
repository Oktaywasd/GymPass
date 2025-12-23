import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { kullanicilar } from '../data/mockData';

const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        kullanici: null,
        girisYapildi: false,
        kullaniciTuru: null, // 'kullanici' veya 'isletme'
        yukleniyor: false,
        hata: null,
        
        // Kullanıcı profil bilgileri
        profilBilgileri: {
          ad: '',
          email: '',
          telefon: '',
          dogumTarihi: '',
          cinsiyet: '',
          hedefler: [],
          deneyimSeviyesi: '',
          saglikDurumu: '',
          tercihler: {
            antrenmanTuru: [],
            gunler: [],
            saatler: []
          }
        },
        
        // İşletme bilgileri (işletme hesapları için)
        isletmeBilgileri: {
          ad: '',
          aciklama: '',
          adres: '',
          telefon: '',
          email: '',
          ozellikler: [],
          acilisSaati: '',
          kapanisSaati: '',
          kategori: '',
          sosyalMedya: {
            instagram: '',
            facebook: ''
          }
        },
        
        // Actions
        setKullanici: (kullanici) => set({ kullanici }),
        
        setGirisYapildi: (durum) => set({ girisYapildi: durum }),
        
        setKullaniciTuru: (tur) => set({ kullaniciTuru: tur }),
        
        setProfilBilgileri: (bilgiler) => {
          const guncelBilgiler = { ...get().profilBilgileri, ...bilgiler };
          set({ profilBilgileri: guncelBilgiler });
        },
        
        setIsletmeBilgileri: (bilgiler) => {
          const guncelBilgiler = { ...get().isletmeBilgileri, ...bilgiler };
          set({ isletmeBilgileri: guncelBilgiler });
        },
        
        // Async actions
        girisYap: async (email, sifre, kullaniciTuru = 'kullanici') => {
          set({ yukleniyor: true, hata: null });
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock giriş kontrolü
            if (email === 'demo@gympass.com' && sifre === '123456') {
              const mockKullanici = {
                id: 1,
                ad: 'Demo Kullanıcı',
                email: email,
                kullaniciTuru: kullaniciTuru
              };
              
              set({
                kullanici: mockKullanici,
                girisYapildi: true,
                kullaniciTuru: kullaniciTuru,
                yukleniyor: false
              });
              
              return { basarili: true };
            } else {
              set({
                hata: 'Geçersiz email veya şifre',
                yukleniyor: false
              });
              return { basarili: false, hata: 'Geçersiz email veya şifre' };
            }
          } catch (error) {
            set({
              hata: 'Giriş yapılırken bir hata oluştu',
              yukleniyor: false
            });
            return { basarili: false, hata: error.message };
          }
        },
        
        kayitOl: async (kayitBilgileri) => {
          set({ yukleniyor: true, hata: null });
          try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const yeniKullanici = {
              id: Date.now(),
              ad: kayitBilgileri.ad,
              email: kayitBilgileri.email,
              kullaniciTuru: kayitBilgileri.kullaniciTuru || 'kullanici'
            };
            
            set({
              kullanici: yeniKullanici,
              girisYapildi: true,
              kullaniciTuru: kayitBilgileri.kullaniciTuru || 'kullanici',
              yukleniyor: false
            });
            
            return { basarili: true };
          } catch (error) {
            set({
              hata: 'Kayıt olurken bir hata oluştu',
              yukleniyor: false
            });
            return { basarili: false, hata: error.message };
          }
        },
        
        cikisYap: () => {
          set({
            kullanici: null,
            girisYapildi: false,
            kullaniciTuru: null,
            profilBilgileri: {
              ad: '',
              email: '',
              telefon: '',
              dogumTarihi: '',
              cinsiyet: '',
              hedefler: [],
              deneyimSeviyesi: '',
              saglikDurumu: '',
              tercihler: {
                antrenmanTuru: [],
                gunler: [],
                saatler: []
              }
            },
            isletmeBilgileri: {
              ad: '',
              aciklama: '',
              adres: '',
              telefon: '',
              email: '',
              ozellikler: [],
              acilisSaati: '',
              kapanisSaati: '',
              kategori: '',
              sosyalMedya: {
                instagram: '',
                facebook: ''
              }
            }
          });
        },
        
        profilGuncelle: async (guncelBilgiler) => {
          set({ yukleniyor: true, hata: null });
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const { kullaniciTuru } = get();
            
            if (kullaniciTuru === 'kullanici') {
              get().setProfilBilgileri(guncelBilgiler);
            } else if (kullaniciTuru === 'isletme') {
              get().setIsletmeBilgileri(guncelBilgiler);
            }
            
            set({ yukleniyor: false });
            return { basarili: true };
          } catch (error) {
            set({
              hata: 'Profil güncellenirken bir hata oluştu',
              yukleniyor: false
            });
            return { basarili: false, hata: error.message };
          }
        },
        
        sifreGuncelle: async (eskiSifre, yeniSifre) => {
          set({ yukleniyor: true, hata: null });
          try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Mock şifre kontrolü
            if (eskiSifre !== '123456') {
              set({
                hata: 'Mevcut şifre yanlış',
                yukleniyor: false
              });
              return { basarili: false, hata: 'Mevcut şifre yanlış' };
            }
            
            set({ yukleniyor: false });
            return { basarili: true };
          } catch (error) {
            set({
              hata: 'Şifre güncellenirken bir hata oluştu',
              yukleniyor: false
            });
            return { basarili: false, hata: error.message };
          }
        },
        
        sifremiUnuttum: async (email) => {
          set({ yukleniyor: true, hata: null });
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({ yukleniyor: false });
            return { basarili: true, mesaj: 'Şifre sıfırlama bağlantısı email adresinize gönderildi' };
          } catch (error) {
            set({
              hata: 'Şifre sıfırlama işlemi sırasında bir hata oluştu',
              yukleniyor: false
            });
            return { basarili: false, hata: error.message };
          }
        },
        
        // Yardımcı fonksiyonlar
        kullaniciGirisYaptiMi: () => get().girisYapildi,
        
        kullaniciTuruAl: () => get().kullaniciTuru,
        
        kullaniciBilgileriAl: () => get().kullanici,
        
        isKullanici: () => get().kullaniciTuru === 'kullanici',
        
        isIsletme: () => get().kullaniciTuru === 'isletme',
        
        temizleHata: () => set({ hata: null })
      }),
      {
        name: 'user-store',
        partialize: (state) => ({
          kullanici: state.kullanici,
          girisYapildi: state.girisYapildi,
          kullaniciTuru: state.kullaniciTuru,
          profilBilgileri: state.profilBilgileri,
          isletmeBilgileri: state.isletmeBilgileri
        })
      }
    ),
    {
      name: 'user-store'
    }
  )
);

export default useUserStore;