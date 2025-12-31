import axios from 'axios';
import { sporSalonlari, kullanicilar } from '../data/mockData';

// Backend API Base URL
export const BASE_URL = 'http://localhost:8080';

// Backend durumu takibi
let backendStatus = {
  isOnline: null, // null = bilinmiyor, true = online, false = offline
  lastCheck: null,
  checkInterval: 30000 // 30 saniye
};

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000 // 5 saniye timeout
});

// Request interceptor - token eklemek için
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Backend durumu kontrol fonksiyonu
const checkBackendStatus = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/actuator/health`, { timeout: 3000 });
    backendStatus.isOnline = true;
    backendStatus.lastCheck = Date.now();
    return true;
  } catch (error) {
    // Alternatif health check - basit endpoint dene
    try {
      await axios.get(`${BASE_URL}/gyms`, { timeout: 3000 });
      backendStatus.isOnline = true;
      backendStatus.lastCheck = Date.now();
      return true;
    } catch (secondError) {
      backendStatus.isOnline = false;
      backendStatus.lastCheck = Date.now();
      console.warn('Backend offline, fallback to mock data');
      return false;
    }
  }
};

// Backend durumu getter
const isBackendOnline = async () => {
  const now = Date.now();
  
  // İlk kontrol veya cache süresi dolmuşsa yeniden kontrol et
  if (backendStatus.isOnline === null ||
      (backendStatus.lastCheck && now - backendStatus.lastCheck > backendStatus.checkInterval)) {
    await checkBackendStatus();
  }
  
  return backendStatus.isOnline;
};

// Response interceptor - error handling için
apiClient.interceptors.response.use(
  (response) => {
    // Başarılı response gelirse backend online
    backendStatus.isOnline = true;
    backendStatus.lastCheck = Date.now();
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Network error veya timeout ise backend offline olabilir
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'TIMEOUT') {
      backendStatus.isOnline = false;
      backendStatus.lastCheck = Date.now();
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// ========== AUTHENTICATION API'LER ==========

export const authAPI = {
  register: async (userData) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
      } catch (error) {
        // Backend error ise fallback'e geç
        console.warn('Backend register failed, using mock data');
      }
    }
    
    // Mock register
    console.log('Using mock register');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    
    const mockUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      balance: 1000,
      token: 'mock-token-' + Date.now()
    };
    
    localStorage.setItem('authToken', mockUser.token);
    return mockUser;
  },

  login: async (credentials) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
      } catch (error) {
        // Backend error ise fallback'e geç
        console.warn('Backend login failed, using mock data');
      }
    }
    
    // Mock login - demo hesap kontrolü
    console.log('Using mock login');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    
    if (credentials.email === 'demo@gympass.com' && credentials.password === '123456') {
      const mockUser = {
        id: 1,
        name: 'Demo Kullanıcı',
        email: credentials.email,
        balance: 1000,
        token: 'mock-token-demo'
      };
      
      localStorage.setItem('authToken', mockUser.token);
      return mockUser;
    }
    
    throw new Error('Geçersiz kullanıcı bilgileri');
  },

  logout: () => {
    localStorage.removeItem('authToken');
  }
};

// ========== GYM MANAGEMENT API'LER ==========

export const gymAPI = {
  // Tüm gym'leri getir
  getAllGyms: async () => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.get('/gyms');
        return response.data;
      } catch (error) {
        console.warn('Backend gym fetch failed, using mock data');
      }
    }
    
    // Mock data
    console.log('Using mock gym data');
    await new Promise(resolve => setTimeout(resolve, 500));
    return sporSalonlari;
  },

  // Yeni gym oluştur
  createGym: async (gymData) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.post('/gyms', gymData);
        return response.data;
      } catch (error) {
        console.warn('Backend gym creation failed, using mock response');
      }
    }
    
    // Mock creation
    console.log('Using mock gym creation');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newGym = {
      id: Date.now(),
      ...gymData,
      createdAt: new Date().toISOString()
    };
    
    return newGym;
  },

  // Gym detayını getir
  getGymById: async (gymId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.get(`/gyms/${gymId}`);
        return response.data;
      } catch (error) {
        console.warn('Backend gym detail fetch failed, using mock data');
      }
    }
    
    // Mock data
    console.log('Using mock gym detail');
    await new Promise(resolve => setTimeout(resolve, 300));
    return sporSalonlari.find(gym => gym.id === gymId) || null;
  }
};

// ========== JOIN REQUEST API'LER ==========

export const joinRequestAPI = {
  // Katılma isteği gönder
  sendJoinRequest: async (requestData) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        // Backend query parameter bekliyor
        const response = await apiClient.post(`/requests/send?userId=${requestData.userId}&gymId=${requestData.gymId}`);
        return {
          id: Date.now(), // Backend ID dönmüyor, mock ID kullan
          userId: requestData.userId,
          gymId: requestData.gymId,
          message: requestData.message,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };
      } catch (error) {
        console.warn('Backend join request failed, using mock response');
      }
    }
    
    // Mock request
    console.log('Using mock join request');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: Date.now(),
      userId: requestData.userId || 1,
      gymId: requestData.gymId,
      message: requestData.message,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
  },

  // İsteği kabul et
  acceptJoinRequest: async (requestId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.post(`/requests/${requestId}/accept`);
        return response.data;
      } catch (error) {
        console.warn('Backend accept request failed, using mock response');
      }
    }
    
    // Mock accept
    console.log('Using mock accept request');
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      id: requestId,
      status: 'ACCEPTED',
      updatedAt: new Date().toISOString()
    };
  },

  // İsteği reddet
  rejectJoinRequest: async (requestId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.post(`/requests/${requestId}/reject`);
        return response.data;
      } catch (error) {
        console.warn('Backend reject request failed, using mock response');
      }
    }
    
    // Mock reject
    console.log('Using mock reject request');
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      id: requestId,
      status: 'REJECTED',
      updatedAt: new Date().toISOString()
    };
  },

  // Kullanıcının isteklerini getir
  getUserRequests: async (userId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.get(`/requests/user/${userId}`);
        return response.data;
      } catch (error) {
        console.warn('Backend user requests failed, using mock data');
      }
    }
    
    // Mock user requests
    console.log('Using mock user requests');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        id: 1,
        userId,
        gymId: 1,
        gymName: 'FitLife Spor Merkezi',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  },

  // Gym'in aldığı istekleri getir
  getGymRequests: async (gymId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.get(`/requests/gym/${gymId}`);
        return response.data;
      } catch (error) {
        console.warn('Backend gym requests failed, using mock data');
      }
    }
    
    // Mock gym requests
    console.log('Using mock gym requests');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        id: 1,
        userId: 1,
        userName: 'Demo Kullanıcı',
        gymId,
        status: 'PENDING',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }
};

// ========== SESSION MANAGEMENT API'LER ==========

export const sessionAPI = {
  // Seans başlat
  startSession: async (requestId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.post(`/sessions/start?requestId=${requestId}`);
        return response.data;
      } catch (error) {
        console.warn('Backend start session failed, using mock response');
      }
    }
    
    // Mock start session
    console.log('Using mock start session');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Date.now(),
      requestId,
      userId: 1,
      gymId: 1,
      status: 'ACTIVE',
      startTime: new Date().toISOString(),
      estimatedCost: 45
    };
  },

  // Aktif seansı getir
  getActiveSession: async (userId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.get(`/sessions/active?userId=${userId}`);
        return response.data;
      } catch (error) {
        console.warn('Backend active session failed, using mock data');
      }
    }
    
    // Mock active session
    console.log('Using mock active session');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return null; // No active session by default
  },

  // Seansı bitir
  endSession: async (sessionId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.post(`/sessions/${sessionId}/end`);
        return response.data;
      } catch (error) {
        console.warn('Backend end session failed, using mock response');
      }
    }
    
    // Mock end session
    console.log('Using mock end session');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: sessionId,
      status: 'COMPLETED',
      endTime: new Date().toISOString(),
      duration: 120, // 2 hours
      totalCost: 90
    };
  },

  // Kullanıcının seans geçmişi
  getUserSessions: async (userId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.get(`/sessions/user/${userId}`);
        return response.data;
      } catch (error) {
        console.warn('Backend user sessions failed, using mock data');
      }
    }
    
    // Mock user sessions
    console.log('Using mock user sessions');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        id: 1,
        gymName: 'FitLife Spor Merkezi',
        startTime: new Date(Date.now() - 86400000).toISOString(),
        endTime: new Date(Date.now() - 82800000).toISOString(),
        duration: 60,
        totalCost: 45,
        status: 'COMPLETED'
      }
    ];
  }
};

// ========== PAYMENT API'LER ==========

export const paymentAPI = {
  // Ödeme yap
  makePayment: async (sessionId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.post(`/payments/pay/${sessionId}`);
        return response.data;
      } catch (error) {
        console.warn('Backend payment failed, using mock response');
      }
    }
    
    // Mock payment
    console.log('Using mock payment');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: Date.now(),
      sessionId,
      amount: 90,
      status: 'COMPLETED',
      paymentDate: new Date().toISOString(),
      paymentMethod: 'CREDIT_CARD'
    };
  },

  // Kullanıcının ödeme geçmişi
  getUserPayments: async (userId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.get(`/payments/user/${userId}`);
        return response.data;
      } catch (error) {
        console.warn('Backend user payments failed, using mock data');
      }
    }
    
    // Mock user payments
    console.log('Using mock user payments');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        id: 1,
        sessionId: 1,
        gymName: 'FitLife Spor Merkezi',
        amount: 45,
        status: 'COMPLETED',
        paymentDate: new Date(Date.now() - 86400000).toISOString(),
        paymentMethod: 'CREDIT_CARD'
      }
    ];
  },

  // Seans ödemesini getir
  getPaymentBySession: async (sessionId) => {
    const isOnline = await isBackendOnline();
    
    if (isOnline) {
      try {
        const response = await apiClient.get(`/payments/session/${sessionId}`);
        return response.data;
      } catch (error) {
        console.warn('Backend session payment failed, using mock data');
      }
    }
    
    // Mock session payment
    console.log('Using mock session payment');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: 1,
      sessionId,
      amount: 90,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
  }
};

// ========== UTILITY FUNCTIONS ==========

export const apiUtils = {
  // Error message formatter
  formatError: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Bir hata oluştu';
  },

  // Success response checker
  isSuccess: (response) => {
    return response && (response.status >= 200 && response.status < 300);
  },

  // Backend durumu kontrol et
  checkBackendStatus: () => checkBackendStatus(),
  
  // Backend online mi kontrol et
  isBackendOnline: () => isBackendOnline(),
  
  // Backend durumu bilgisini al
  getBackendStatus: () => ({
    isOnline: backendStatus.isOnline,
    lastCheck: backendStatus.lastCheck,
    checkInterval: backendStatus.checkInterval
  })
};

// ========== COMBINED API OBJECT ==========

const api = {
  auth: authAPI,
  gym: gymAPI,
  joinRequest: joinRequestAPI,
  session: sessionAPI,
  payment: paymentAPI,
  utils: apiUtils
};

export default api;