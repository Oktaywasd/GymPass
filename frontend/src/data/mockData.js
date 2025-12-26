// Mock veri yapısı - GymPass uygulaması için
export const sporSalonlari = [
  {
    id: 1,
    ad: "FitLife Spor Merkezi",
    aciklama: "Modern ekipmanlar ve profesyonel eğitmenlerle tam donanımlı spor merkezi",
    resim: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    konum: "Beşiktaş, İstanbul",
    puan: 4.8,
    yorumSayisi: 124,
    saatlikUcret: 45,
    ozellikler: ["Kardio", "Ağırlık", "Grup Dersleri", "Sauna"],
    acilisSaati: "06:00",
    kapanisSaati: "23:00",
    musaitlik: "yuksek", // yuksek, orta, dusuk
    kategori: "premium",
    telefon: "+90 212 555 0101",
    adres: "Barbaros Bulvarı No:145 Beşiktaş/İstanbul",
    sosyalMedya: {
      instagram: "@fitlife_besiktas",
      facebook: "FitLifeSporMerkezi"
    }
  },
  {
    id: 2,
    ad: "PowerGym Kadıköy",
    aciklama: "Güçlü antrenmanlar için ideal ortam, deneyimli antrenörler",
    resim: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    konum: "Kadıköy, İstanbul",
    puan: 4.6,
    yorumSayisi: 89,
    saatlikUcret: 35,
    ozellikler: ["CrossFit", "Ağırlık", "Fonksiyonel", "Boks"],
    acilisSaati: "05:30",
    kapanisSaati: "24:00",
    musaitlik: "orta",
    kategori: "standart",
    telefon: "+90 216 555 0202",
    adres: "Moda Caddesi No:78 Kadıköy/İstanbul",
    sosyalMedya: {
      instagram: "@powergym_kadikoy",
      facebook: "PowerGymKadikoy"
    }
  },
  {
    id: 3,
    ad: "Yoga & Wellness Studio",
    aciklama: "Huzurlu ortamda yoga, pilates ve meditasyon seansları",
    resim: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    konum: "Nişantaşı, İstanbul",
    puan: 4.9,
    yorumSayisi: 156,
    saatlikUcret: 55,
    ozellikler: ["Yoga", "Pilates", "Meditasyon", "Stretching"],
    acilisSaati: "07:00",
    kapanisSaati: "22:00",
    musaitlik: "dusuk",
    kategori: "premium",
    telefon: "+90 212 555 0303",
    adres: "Teşvikiye Caddesi No:92 Nişantaşı/İstanbul",
    sosyalMedya: {
      instagram: "@yogawellness_nisantasi",
      facebook: "YogaWellnessStudio"
    }
  },
  {
    id: 4,
    ad: "Iron Temple Gym",
    aciklama: "Hardcore antrenman severlerin tercihi, ağır ekipmanlar",
    resim: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
    konum: "Şişli, İstanbul",
    puan: 4.7,
    yorumSayisi: 203,
    saatlikUcret: 40,
    ozellikler: ["Powerlifting", "Bodybuilding", "Ağırlık", "Kardio"],
    acilisSaati: "06:00",
    kapanisSaati: "23:30",
    musaitlik: "yuksek",
    kategori: "standart",
    telefon: "+90 212 555 0404",
    adres: "Mecidiyeköy Mahallesi No:234 Şişli/İstanbul",
    sosyalMedya: {
      instagram: "@irontemple_sisli",
      facebook: "IronTempleGym"
    }
  },
  {
    id: 5,
    ad: "Aqua Fitness Center",
    aciklama: "Su sporları ve yüzme odaklı fitness merkezi",
    resim: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop",
    konum: "Etiler, İstanbul",
    puan: 4.5,
    yorumSayisi: 67,
    saatlikUcret: 60,
    ozellikler: ["Yüzme", "Aqua Aerobik", "Su Sporları", "Sauna"],
    acilisSaati: "06:30",
    kapanisSaati: "22:30",
    musaitlik: "orta",
    kategori: "premium",
    telefon: "+90 212 555 0505",
    adres: "Etiler Mahallesi No:45 Beşiktaş/İstanbul",
    sosyalMedya: {
      instagram: "@aquafitness_etiler",
      facebook: "AquaFitnessCenter"
    }
  },
  {
    id: 6,
    ad: "Urban Fitness Lab",
    aciklama: "Şehrin kalbinde modern teknoloji ile donatılmış spor merkezi",
    resim: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    konum: "Taksim, İstanbul",
    puan: 4.4,
    yorumSayisi: 91,
    saatlikUcret: 50,
    ozellikler: ["HIIT", "TRX", "Spinning", "Grup Dersleri"],
    acilisSaati: "07:00",
    kapanisSaati: "23:00",
    musaitlik: "yuksek",
    kategori: "standart",
    telefon: "+90 212 555 0606",
    adres: "İstiklal Caddesi No:167 Beyoğlu/İstanbul",
    sosyalMedya: {
      instagram: "@urbanfitness_taksim",
      facebook: "UrbanFitnessLab"
    }
  }
];

export const egitmenler = [
  {
    id: 1,
    ad: "Ahmet Kaya",
    uzmanlik: ["Kişisel Antrenman", "Bodybuilding", "Beslenme"],
    deneyim: 8,
    resim: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face",
    puan: 4.9,
    yorumSayisi: 45,
    saatlikUcret: 120,
    aciklama: "8 yıllık deneyimle kişisel antrenman ve beslenme koçluğu",
    sertifikalar: ["ACSM-CPT", "Beslenme Uzmanı", "TRX Eğitmeni"],
    musaitlik: "yuksek",
    sporSalonu: 1,
    telefon: "+90 532 555 0101",
    sosyalMedya: {
      instagram: "@ahmet_pt_coach"
    }
  },
  {
    id: 2,
    ad: "Elif Demir",
    uzmanlik: ["Yoga", "Pilates", "Meditasyon"],
    deneyim: 6,
    resim: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    puan: 4.8,
    yorumSayisi: 67,
    saatlikUcret: 100,
    aciklama: "Yoga ve pilates uzmanı, zihin-beden dengesine odaklı yaklaşım",
    sertifikalar: ["RYT-500", "Pilates Mat Eğitmeni", "Meditasyon Uzmanı"],
    musaitlik: "orta",
    sporSalonu: 3,
    telefon: "+90 532 555 0202",
    sosyalMedya: {
      instagram: "@elif_yoga_pilates"
    }
  },
  {
    id: 3,
    ad: "Murat Özkan",
    uzmanlik: ["CrossFit", "Fonksiyonel Antrenman", "HIIT"],
    deneyim: 10,
    resim: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    puan: 4.7,
    yorumSayisi: 89,
    saatlikUcret: 110,
    aciklama: "CrossFit Level 2 trainer, fonksiyonel hareket uzmanı",
    sertifikalar: ["CrossFit Level 2", "FMS", "Kettlebell Uzmanı"],
    musaitlik: "yuksek",
    sporSalonu: 2,
    telefon: "+90 532 555 0303",
    sosyalMedya: {
      instagram: "@murat_crossfit_coach"
    }
  },
  {
    id: 4,
    ad: "Zeynep Yılmaz",
    uzmanlik: ["Yüzme", "Aqua Fitness", "Rehabilitasyon"],
    deneyim: 7,
    resim: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    puan: 4.9,
    yorumSayisi: 34,
    saatlikUcret: 130,
    aciklama: "Yüzme antrenörü ve su sporları uzmanı, rehabilitasyon desteği",
    sertifikalar: ["Yüzme Antrenörü", "Aqua Fitness", "Fizyoterapi Desteği"],
    musaitlik: "dusuk",
    sporSalonu: 5,
    telefon: "+90 532 555 0404",
    sosyalMedya: {
      instagram: "@zeynep_swim_coach"
    }
  }
];

export const kullanicilar = [
  {
    id: 1,
    ad: "Can Yılmaz",
    email: "can.yilmaz@email.com",
    telefon: "+90 532 123 4567",
    dogumTarihi: "1990-05-15",
    cinsiyet: "erkek",
    hedefler: ["Kilo Verme", "Kas Geliştirme"],
    deneyimSeviyesi: "orta",
    saglikDurumu: "iyi",
    tercihler: {
      antrenmanTuru: ["Ağırlık", "Kardio"],
      gunler: ["Pazartesi", "Çarşamba", "Cuma"],
      saatler: ["18:00-20:00"]
    },
    uyelikTarihi: "2024-01-15",
    aktifPlan: "premium"
  }
];

export const rezervasyonlar = [
  {
    id: 1,
    kullaniciId: 1,
    sporSalonuId: 1,
    egitmenId: 1,
    tarih: "2024-12-24",
    saat: "18:00",
    sure: 60, // dakika
    durum: "onaylandi", // beklemede, onaylandi, reddedildi, tamamlandi
    ucret: 120,
    notlar: "İlk antrenman seansı",
    olusturmaTarihi: "2024-12-20T10:30:00Z",
    onayTarihi: "2024-12-20T14:15:00Z"
  },
  {
    id: 2,
    kullaniciId: 1,
    sporSalonuId: 3,
    egitmenId: 2,
    tarih: "2024-12-26",
    saat: "10:00",
    sure: 90,
    durum: "beklemede",
    ucret: 100,
    notlar: "Yoga seansı",
    olusturmaTarihi: "2024-12-22T09:00:00Z"
  }
];

export const yorumlar = [
  {
    id: 1,
    kullaniciId: 1,
    sporSalonuId: 1,
    egitmenId: 1,
    puan: 5,
    yorum: "Harika bir deneyim! Ahmet hoca çok profesyonel ve motivasyonu yüksek.",
    tarih: "2024-12-15T16:30:00Z",
    faydali: 12
  },
  {
    id: 2,
    kullaniciId: 1,
    sporSalonuId: 3,
    puan: 5,
    yorum: "Yoga stüdyosu çok huzurlu, temiz ve ferah. Kesinlikle tavsiye ederim.",
    tarih: "2024-12-10T11:20:00Z",
    faydali: 8
  }
];

// Yardımcı fonksiyonlar
export const getSporSalonuById = (id) => {
  return sporSalonlari.find(salon => salon.id === id);
};

export const getEgitmenById = (id) => {
  return egitmenler.find(egitmen => egitmen.id === id);
};

export const getEgitmenlerBySporSalonu = (sporSalonuId) => {
  return egitmenler.filter(egitmen => egitmen.sporSalonu === sporSalonuId);
};

export const getRezervasyonlarByKullanici = (kullaniciId) => {
  return rezervasyonlar.filter(rezervasyon => rezervasyon.kullaniciId === kullaniciId);
};

export const getYorumlarBySporSalonu = (sporSalonuId) => {
  return yorumlar.filter(yorum => yorum.sporSalonuId === sporSalonuId);
};

// Filtreleme fonksiyonları
export const filterSporSalonlari = (filtreler, salonlar = sporSalonlari) => {
  let filtrelenmis = [...salonlar];
  
  if (filtreler.konum) {
    filtrelenmis = filtrelenmis.filter(salon =>
      salon.konum.toLowerCase().includes(filtreler.konum.toLowerCase())
    );
  }
  
  if (filtreler.minPuan) {
    filtrelenmis = filtrelenmis.filter(salon => salon.puan >= filtreler.minPuan);
  }
  
  if (filtreler.maxUcret) {
    filtrelenmis = filtrelenmis.filter(salon => salon.saatlikUcret <= filtreler.maxUcret);
  }
  
  if (filtreler.ozellikler && filtreler.ozellikler.length > 0) {
    filtrelenmis = filtrelenmis.filter(salon =>
      filtreler.ozellikler.some(ozellik => salon.ozellikler.includes(ozellik))
    );
  }
  
  if (filtreler.kategori) {
    filtrelenmis = filtrelenmis.filter(salon => salon.kategori === filtreler.kategori);
  }
  
  if (filtreler.musaitlik) {
    filtrelenmis = filtrelenmis.filter(salon => salon.musaitlik === filtreler.musaitlik);
  }
  
  return filtrelenmis;
};

export const siralamaSecenekleri = [
  { deger: 'puan-desc', etiket: 'En Yüksek Puan' },
  { deger: 'puan-asc', etiket: 'En Düşük Puan' },
  { deger: 'ucret-asc', etiket: 'En Uygun Fiyat' },
  { deger: 'ucret-desc', etiket: 'En Yüksek Fiyat' },
  { deger: 'yorum-desc', etiket: 'En Çok Yorumlanan' }
];

export const siralaSporSalonlari = (salonlar, siralama) => {
  const sirali = [...salonlar];
  
  switch (siralama) {
    case 'puan-desc':
      return sirali.sort((a, b) => b.puan - a.puan);
    case 'puan-asc':
      return sirali.sort((a, b) => a.puan - b.puan);
    case 'ucret-asc':
      return sirali.sort((a, b) => a.saatlikUcret - b.saatlikUcret);
    case 'ucret-desc':
      return sirali.sort((a, b) => b.saatlikUcret - a.saatlikUcret);
    case 'yorum-desc':
      return sirali.sort((a, b) => b.yorumSayisi - a.yorumSayisi);
    default:
      return sirali;
  }
};