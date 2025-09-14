import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  }

  private async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  private async removeToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    try {
      const response = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.token) {
        await this.setToken(response.token);
      }

      return response;
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async signup(businessName: string, email: string, password: string) {
    try {
      const response = await this.request('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ business_name: businessName, email, password }),
      });

      if (response.token) {
        await this.setToken(response.token);
      }

      return response;
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  }

  async logout() {
    await this.removeToken();
  }

  async getCurrentUser() {
    try {
      return await this.request('/api/auth/me');
    } catch (error) {
      return { success: false };
    }
  }

  // WhatsApp endpoints
  async connectWhatsApp() {
    try {
      return await this.request('/api/whatsapp/connect', {
        method: 'POST',
      });
    } catch (error) {
      return { success: false, error: 'WhatsApp connection failed' };
    }
  }

  async disconnectWhatsApp() {
    try {
      return await this.request('/api/whatsapp/disconnect', {
        method: 'POST',
      });
    } catch (error) {
      console.error('WhatsApp disconnect failed:', error);
    }
  }

  // Conversations endpoints
  async getConversations() {
    return await this.request('/api/conversations');
  }

  async getConversation(id: string) {
    return await this.request(`/api/conversations/${id}`);
  }

  async getMessages(conversationId: string) {
    return await this.request(`/api/conversations/${conversationId}/messages`);
  }

  // Analytics endpoints
  async getAnalytics() {
    return await this.request('/api/analytics');
  }
}

export const apiService = new ApiService();