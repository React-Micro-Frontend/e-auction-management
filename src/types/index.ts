export interface Auction {
  id: string;
  auctionNumber: string;
  itemDescription: string;
  category: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Live' | 'Closed' | 'Cancelled';
  startingBid: number;
  currentBid: number;
  totalBids: number;
  highestBidder?: string;
}

export interface AuctionActivity {
  id: string;
  description: string;
  timestamp: Date;
  type: 'bid' | 'start' | 'end' | 'winner';
}
