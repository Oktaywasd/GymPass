import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';
import { rezervasyonlar, getRezervasyonlarByKullanici } from '../data/mockData';

const useReservationStore = create(
  devtools(
    (set, get) => ({
      // State
      rezervasyonlar: rezervasyonlar,
      kullaniciRezervasyonlari: [],
      seciliRezervasyonTarihi: null,
      seciliRezervasyonSaati: null,
      rezervasyonFormu: {
        sporSalonuId: null,
        egitmenId: null,
        tarih: '',
        saat: '',
        sure: 60,
        notlar: ''
      },
      musaitSaatler: [],
      yukleniyor: false,
      hata: null,
      rezervasyonModalAcik: false,
      
      // Actions
      setRezervasyonModalAcik: (acik) => set({ rezervasyonModalAcik: acik }),
      
      setRezervasyonFormu: (form) => {
        const guncelForm = { ...get().rezervasyonFormu, ...form };
        set({ rezervasyonFormu: guncelForm });
      },
      
      setSeciliTarih: (tarih) => {
        set({ seciliRezervasyonTarihi: tarih });
        // Tarih seçildiğinde müsait saatleri yükle
        get().musaitSaatleriYukle(tarih);
      },
      
      setSeciliSaat: (saat) => {
        set({ seciliRezervasyonSaati: saat });
        const guncelForm = { ...get().rezervasyonFormu, saat };
        set({ rezervasyonFormu: guncelForm });
      },
      
      rezervasyonFormunuTemizle: () => {
        set({
          rezervasyonFormu: {
            sporSalonuId: null,
            egitmenId: null,
            tarih: '',
            saat: '',
            sure: 60,
            notlar: ''
          },
          seciliRezervasyonTarihi: null,
          seciliRezervasyonSaati: null,
          musaitSaatler: []
        });
      },
      
      // Async actions
      kullaniciRezervasyonlariniYukle: async (kullaniciId) => {
        set({ yukleniyor: true, hata: null });
        
        // Backend durumunu kontrol et
        const backendOnline = await api.utils.isBackendOnline();
        
        if (backendOnline) {
          try {
            // Backend API'den kullanıcı rezervasyonlarını al
            const response = await api.session.getUserSessions(kullaniciId);
            const kullaniciRezervasyonlari = response.map(session => ({
              id: session.id,
              kullaniciId: session.userId,
              sporSalonuId: session.gymId,
              tarih: session.sessionDate,
              saat: session.startTime,
              sure: session.duration || 60,
              durum: session.status === 'ACTIVE' ? 'onaylandi' :
                     session.status === 'COMPLETED' ? 'tamamlandi' : 'beklemede',
              ucret: session.price,
              olusturmaTarihi: session.createdAt
            }));
            
            set({
              kullaniciRezervasyonlari,
              yukleniyor: false
            });
          } catch (error) {
            console.error('Backend rezervasyon yükleme hatası:', error);
            set({
              hata: api.utils.formatError(error),
              yukleniyor: false
            });
          }
        } else {
          // Backend offline - Mock data kullan
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const kullaniciRezervasyonlari = getRezervasyonlarByKullanici(kullaniciId);
            set({
              kullaniciRezervasyonlari,
              yukleniyor: false
            });
          } catch (error) {
            set({
              hata: 'Rezervasyonlar yüklenirken bir hata oluştu',
              yukleniyor: false
            });
          }
        }
      },
      
      musaitSaatleriYukle: async (tarih, sporSalonuId = null, egitmenId = null) => {
        set({ yukleniyor: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Mock müsait saatler - gerçek uygulamada API'den gelecek
          const tumSaatler = [
            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
            '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
          ];
          
          // Mevcut rezervasyonları kontrol et
          const mevcutRezervasyonlar = get().rezervasyonlar.filter(r => 
            r.tarih === tarih && 
            (sporSalonuId ? r.sporSalonuId === sporSalonuId : true) &&
            (egitmenId ? r.egitmenId === egitmenId : true)
          );
          
          const doluSaatler = mevcutRezervasyonlar.map(r => r.saat);
          const musaitSaatler = tumSaatler.filter(saat => !doluSaatler.includes(saat));
          
          set({ 
            musaitSaatler,
            yukleniyor: false 
          });
        } catch (error) {
          set({ 
            hata: 'Müsait saatler yüklenirken bir hata oluştu',
            yukleniyor: false 
          });
        }
      },
      
      rezervasyonOlustur: async (rezervasyonVerisi) => {
        set({ yukleniyor: true, hata: null });
        
        // Backend durumunu kontrol et
        const backendOnline = await api.utils.isBackendOnline();
        
        if (backendOnline) {
          try {
            // Kullanıcı ID'sini al (useUserStore'dan)
            const kullaniciId = 1; // Şimdilik sabit, gerçek uygulamada auth'dan gelecek
            
            // Backend API ile katılma isteği oluştur
            const response = await api.joinRequest.sendJoinRequest({
              userId: kullaniciId,
              gymId: rezervasyonVerisi.sporSalonuId,
              message: `Tarih: ${rezervasyonVerisi.tarih}, Saat: ${rezervasyonVerisi.saat}, Süre: ${rezervasyonVerisi.sure} dakika. ${rezervasyonVerisi.notlar || ''}`
            });
            
            const yeniRezervasyonObj = {
              id: response.id,
              kullaniciId: response.userId,
              sporSalonuId: response.gymId,
              tarih: rezervasyonVerisi.tarih,
              saat: rezervasyonVerisi.saat,
              sure: rezervasyonVerisi.sure,
              durum: 'beklemede', // Join request başlangıçta beklemede
              ucret: rezervasyonVerisi.ucret,
              notlar: rezervasyonVerisi.notlar || '',
              olusturmaTarihi: response.createdAt,
              mesaj: response.message
            };
            
            const guncelRezervasyonlar = [...get().rezervasyonlar, yeniRezervasyonObj];
            set({
              rezervasyonlar: guncelRezervasyonlar,
              yukleniyor: false
            });
            
            return { basarili: true, rezervasyonId: response.id };
          } catch (error) {
            console.error('Backend rezervasyon oluşturma hatası:', error);
            set({
              hata: api.utils.formatError(error),
              yukleniyor: false
            });
            return { basarili: false, hata: api.utils.formatError(error) };
          }
        } else {
          // Backend offline - Mock rezervasyon oluştur
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const yeniRezervasyonId = Math.max(...get().rezervasyonlar.map(r => r.id)) + 1;
            const yeniRezervasyonTarihi = new Date().toISOString();
            
            const yeniRezervasyonObj = {
              id: yeniRezervasyonId,
              kullaniciId: 1, // Mock kullanıcı ID
              sporSalonuId: rezervasyonVerisi.sporSalonuId,
              egitmenId: rezervasyonVerisi.egitmenId,
              tarih: rezervasyonVerisi.tarih,
              saat: rezervasyonVerisi.saat,
              sure: rezervasyonVerisi.sure,
              durum: 'beklemede',
              ucret: rezervasyonVerisi.ucret,
              notlar: rezervasyonVerisi.notlar || '',
              olusturmaTarihi: yeniRezervasyonTarihi
            };
            
            const guncelRezervasyonlar = [...get().rezervasyonlar, yeniRezervasyonObj];
            set({
              rezervasyonlar: guncelRezervasyonlar,
              yukleniyor: false
            });
            
            return { basarili: true, rezervasyonId: yeniRezervasyonId };
          } catch (error) {
            set({
              hata: 'Rezervasyon oluşturulurken bir hata oluştu',
              yukleniyor: false
            });
            return { basarili: false, hata: error.message };
          }
        }
      },
      
      rezervasyonIptalEt: async (rezervasyonId) => {
        set({ yukleniyor: true, hata: null });
        
        // Backend durumunu kontrol et
        const backendOnline = await api.utils.isBackendOnline();
        
        if (backendOnline) {
          try {
            // Backend API ile rezervasyon iptal et
            await api.session.endSession(rezervasyonId);
            
            const guncelRezervasyonlar = get().rezervasyonlar.map(r =>
              r.id === rezervasyonId ? { ...r, durum: 'iptal' } : r
            );
            
            set({
              rezervasyonlar: guncelRezervasyonlar,
              yukleniyor: false
            });
            
            return { basarili: true };
          } catch (error) {
            console.error('Backend rezervasyon iptal hatası:', error);
            set({
              hata: api.utils.formatError(error),
              yukleniyor: false
            });
            return { basarili: false, hata: api.utils.formatError(error) };
          }
        } else {
          // Backend offline - Mock iptal
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const guncelRezervasyonlar = get().rezervasyonlar.map(r =>
              r.id === rezervasyonId ? { ...r, durum: 'iptal' } : r
            );
            
            set({
              rezervasyonlar: guncelRezervasyonlar,
              yukleniyor: false
            });
            
            return { basarili: true };
          } catch (error) {
            set({
              hata: 'Rezervasyon iptal edilirken bir hata oluştu',
              yukleniyor: false
            });
            return { basarili: false, hata: error.message };
          }
        }
      },
      
      rezervasyonDurumunuGuncelle: async (rezervasyonId, yeniDurum) => {
        set({ yukleniyor: true, hata: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const guncelRezervasyonlar = get().rezervasyonlar.map(r =>
            r.id === rezervasyonId ? { 
              ...r, 
              durum: yeniDurum,
              onayTarihi: yeniDurum === 'onaylandi' ? new Date().toISOString() : r.onayTarihi
            } : r
          );
          
          set({ 
            rezervasyonlar: guncelRezervasyonlar,
            yukleniyor: false 
          });
          
          return { basarili: true };
        } catch (error) {
          set({ 
            hata: 'Rezervasyon durumu güncellenirken bir hata oluştu',
            yukleniyor: false 
          });
          return { basarili: false, hata: error.message };
        }
      },
      
      // Yardımcı fonksiyonlar
      getRezervasyonById: (rezervasyonId) => {
        return get().rezervasyonlar.find(r => r.id === rezervasyonId);
      },
      
      getBekleyenRezervasyonlar: () => {
        return get().rezervasyonlar.filter(r => r.durum === 'beklemede');
      },
      
      getOnaylananRezervasyonlar: () => {
        return get().rezervasyonlar.filter(r => r.durum === 'onaylandi');
      },
      
      getBugunRezervasyonlari: () => {
        const bugun = new Date().toISOString().split('T')[0];
        return get().rezervasyonlar.filter(r => r.tarih === bugun);
      }
    }),
    {
      name: 'reservation-store'
    }
  )
);

export default useReservationStore;