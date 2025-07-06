const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Helper method to make API calls
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // Task methods
  async getTasks() {
    return this.makeRequest('/tasks');
  }

  async createTask(taskData) {
    return this.makeRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId, updates) {
    return this.makeRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId) {
    return this.makeRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async toggleTask(taskId) {
    return this.makeRequest(`/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
  }

  async reorderTasks(tasks) {
    return this.makeRequest('/tasks/reorder', {
      method: 'PUT',
      body: JSON.stringify({ tasks }),
    });
  }

  // Note methods
  async getNotes() {
    return this.makeRequest('/notes');
  }

  async createNote(noteData) {
    return this.makeRequest('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(noteId, updates) {
    return this.makeRequest(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteNote(noteId) {
    return this.makeRequest(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  async toggleNotePin(noteId) {
    return this.makeRequest(`/notes/${noteId}/pin`, {
      method: 'PATCH',
    });
  }

  // Timer session methods
  async getTimerSessions() {
    return this.makeRequest('/timer-sessions');
  }

  async createTimerSession(sessionData) {
    return this.makeRequest('/timer-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateTimerSession(sessionId, updates) {
    return this.makeRequest(`/timer-sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTimerSession(sessionId) {
    return this.makeRequest(`/timer-sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Analytics methods
  async getAnalytics() {
    return this.makeRequest('/analytics');
  }

  async getTaskAnalytics() {
    return this.makeRequest('/analytics/tasks');
  }

  async getTimerAnalytics() {
    return this.makeRequest('/analytics/timer');
  }

  async getNoteAnalytics() {
    return this.makeRequest('/analytics/notes');
  }

  // User profile methods
  async getUserProfile() {
    return this.makeRequest('/user/profile');
  }

  async updateUserProfile(profileData) {
    return this.makeRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.makeRequest('/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }
}

export const apiService = new ApiService(); 