// MOCK AUTHENTICATION - TEMPORARY REPLACEMENT FOR BACKEND AUTH
// TODO: Uncomment the original functions when reconnecting to backend

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'super-admin';
  isActive: boolean;
  lastLogin?: string;
}

// MOCK AUTHENTICATION FUNCTIONS (TEMPORARY)
export function mockLogin(username: string, password: string): boolean {
  // Mock login - accept any non-empty credentials
  if (username && password) {
    const mockUser: AdminUser = {
      _id: 'mock-admin-id',
      username: username,
      email: `${username}@shotokanbd.com`,
      role: 'admin',
      isActive: true,
      lastLogin: new Date().toISOString()
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('adminToken', mockToken);
    localStorage.setItem('adminUser', JSON.stringify(mockUser));
    
    return true;
  }
  return false;
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('adminUser');
  return userStr ? JSON.parse(userStr) : null;
}

export function removeAdminAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
}

export function isAuthenticated(): boolean {
  return !!getAdminToken();
}

// COMMENTED OUT - ORIGINAL BACKEND REQUEST FUNCTION
// TODO: Uncomment when reconnecting to backend
/*
export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  const token = getAdminToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    removeAdminAuth();
    window.location.href = '/admin/login';
    throw new Error('Authentication expired');
  }

  return response;
}
*/

// MOCK REQUEST FUNCTION - TEMPORARY REPLACEMENT
export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  // Mock function that simulates authenticated requests
  // This is temporary and should be removed when reconnecting to backend
  
  const token = getAdminToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock response based on URL pattern
  const mockResponse = {
    ok: true,
    status: 200,
    json: async () => ({ success: true, data: {} })
  };
  
  return mockResponse as Response;
}