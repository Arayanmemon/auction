export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  message?: string;
  success?: boolean; 
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  profile_pic?: File | string;
  first_name: string;
  last_name: string;
  address?: string;
  phone: string;
}

export interface OtpVerificationRequest {
  email?: string;
  phone?: string;
  otp: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  startingBid: number;
  currentBid: number;
  endTime: string;
  sellerId: string;
  status: 'active' | 'ended' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  amount: number;
  bidderId: string;
  auctionId: string;
  createdAt: string;
}
