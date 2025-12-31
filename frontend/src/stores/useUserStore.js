import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '../services/api';
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
          
          // Backend durumunu kontrol et
          const backendOnline = await api.utils.isBackendOnline();
          
          if (backendOnline) {
            try {
              // Backend API ile giriş yap
              const response = await api.auth.login({ email, password: sifre });
              
              const kullanici = {
                id: response.id,
                ad: response.name,
                email: response.email,
                balance: response.balance,
                kullaniciTuru: kullaniciTuru
              };
              
              set({
                kullanici: kullanici,
                girisYapildi: true,
                kullaniciTuru: kullaniciTuru,
                yukleniyor: false
              });
              
              return { basarili: true, kullanici };
            } catch (error) {
              console.error('Backend giriş hatası:', error);
              const hataMessaji = api.utils.formatError(error);
              set({
                hata: hataMessaji,
                yukleniyor: false
              });
              return { basarili: false, hata: hataMessaji };
            }
          } else {
            // Backend offline - Mock giriş kontrolü
            if (email === 'demo@gympass.com' && sifre === '123456') {
              const mockKullanici = {
                id: 1,
                ad: 'Demo Kullanıcı',
                email: email,
                balance: 1000,
                kullaniciTuru: kullaniciTuru
              };
              
              set({
                kullanici: mockKullanici,
                girisYapildi: true,
                kullaniciTuru: kullaniciTuru,
                yukleniyor: false
              });
              
              return { basarili: true, kullanici: mockKullanici };
            } else {
              set({
                hata: 'Geçersiz giriş bilgileri (Backend offline - demo hesabı kullanın)',
                yukleniyor: false
              });
              return { basarili: false, hata: 'Geçersiz giriş bilgileri' };
            }
          }
        },
        
        kayitOl: async (kayitBilgileri) => {
          set({ yukleniyor: true, hata: null });
          
          // Backend durumunu kontrol et
          const backendOnline = await api.utils.isBackendOnline();
          
          if (backendOnline) {
            try {
              // Backend API ile kayıt ol
              const response = await api.auth.register({
                name: kayitBilgileri.ad,
                email: kayitBilgileri.email,
                password: kayitBilgileri.sifre
              });
              
              const yeniKullanici = {
                id: response.id,
                ad: response.name,
                email: response.email,
                balance: response.balance,
                kullaniciTuru: kayitBilgileri.kullaniciTuru || 'kullanici'
              };
              
              set({
                kullanici: yeniKullanici,
                girisYapildi: true,
                kullaniciTuru: kayitBilgileri.kullaniciTuru || 'kullanici',
                yukleniyor: false
              });
              
              return { basarili: true, kullanici: yeniKullanici };
            } catch (error) {
              console.error('Backend kayıt hatası:', error);
              const hataMessaji = api.utils.formatError(error);
              set({
                hata: hataMessaji,
                yukleniyor: false
              });
              return { basarili: false, hata: hataMessaji };
            }
          } else {
            // Backend offline - Mock kayıt
            const yeniKullanici = {
              id: Date.now(),
              ad: kayitBilgileri.ad,
              email: kayitBilgileri.email,
              balance: 1000,
              kullaniciTuru: kayitBilgileri.kullaniciTuru || 'kullanici'
            };
            
            set({
              kullanici: yeniKullanici,
              girisYapildi: true,
              kullaniciTuru: kayitBilgileri.kullaniciTuru || 'kullanici',
              yukleniyor: false
            });
            
            return { basarili: true, kullanici: yeniKullanici };
          }
        },
        
        cikisYap: () => {
          // Backend'den çıkış yap
          api.auth.logout();
          
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