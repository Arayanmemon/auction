import { apiClient } from '../client';
import { ApiResponse, Auction, Bid } from '../types';

export class AuctionService {
  static async getAuctions(): Promise<Auction[]> {
    const response = await apiClient.get<ApiResponse<Auction[]>>('/auctions');
    return response.data;
  }

  static async getAuction(id: string): Promise<Auction> {
    const response = await apiClient.get<ApiResponse<Auction>>(`/auctions/${id}`);
    return response.data;
  }

  static async createAuction(auctionData: Partial<Auction>): Promise<Auction> {
    const response = await apiClient.post<ApiResponse<Auction>>('/auctions', auctionData);
    return response.data;
  }

  static async updateAuction(id: string, auctionData: Partial<Auction>): Promise<Auction> {
    const response = await apiClient.put<ApiResponse<Auction>>(`/auctions/${id}`, auctionData);
    return response.data;
  }

  static async deleteAuction(id: string): Promise<void> {
    await apiClient.delete(`/auctions/${id}`);
  }

  static async placeBid(auctionId: string, amount: number): Promise<Bid> {
    const response = await apiClient.post<ApiResponse<Bid>>(`/auctions/${auctionId}/bids`, { amount });
    return response.data;
  }

  static async getBids(auctionId: string): Promise<Bid[]> {
    const response = await apiClient.get<ApiResponse<Bid[]>>(`/auctions/${auctionId}/bids`);
    return response.data;
  }
}
