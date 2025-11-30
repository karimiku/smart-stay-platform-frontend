const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponse {
  user_id: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  expires_in: number;
}

export interface ApiError {
  error: string;
}

/**
 * Sign up a new user
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Required for cookies
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Signup failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Login and get JWT token (stored in httpOnly cookie)
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Required for cookies
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Login failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get current user info (requires authentication)
 * Token is automatically sent via httpOnly cookie
 */
export async function getMe() {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Required for cookies
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to get user info: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Logout user (clears httpOnly cookie)
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include', // Required for cookies
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Logout failed: ${response.statusText}`);
  }
}

// Reservation types
export interface CreateReservationRequest {
  room_id: number;
  start_date: string; // Format: YYYY-MM-DD
  end_date: string; // Format: YYYY-MM-DD
}

export interface Reservation {
  id: string;
  user_id: string;
  room_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}

export interface CreateReservationResponse {
  reservation_id: string;
  status: string;
}

export interface ListReservationsResponse {
  reservations: Reservation[];
}

/**
 * Create a new reservation
 */
export async function createReservation(data: CreateReservationRequest): Promise<CreateReservationResponse> {
  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Reservation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all reservations for the current user
 */
export async function getReservations(): Promise<ListReservationsResponse> {
  const response = await fetch(`${API_URL}/reservations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to get reservations: ${response.statusText}`);
  }

  return response.json();
}

// Key types
export interface Key {
  key_code: string;
  device_id: string;
  reservation_id: string;
  valid_from: string;
  valid_until: string;
}

export interface ListKeysResponse {
  keys: Key[];
}

/**
 * Get all keys for the current user
 */
export async function getKeys(): Promise<ListKeysResponse> {
  const response = await fetch(`${API_URL}/keys`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to get keys: ${response.statusText}`);
  }

  return response.json();
}

