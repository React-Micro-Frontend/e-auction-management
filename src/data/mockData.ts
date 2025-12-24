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

export const mockAuctions: Auction[] = [
  {
    id: '1',
    auctionNumber: 'AUC-2024-001',
    itemDescription: 'Confiscated Electronics (Laptops, Phones)',
    category: 'Electronics',
    startDate: '2024-12-20',
    endDate: '2024-12-27',
    status: 'Live',
    startingBid: 50000,
    currentBid: 125000,
    totalBids: 15,
    highestBidder: 'TechBuy Corp.'
  },
  {
    id: '2',
    auctionNumber: 'AUC-2024-002',
    itemDescription: 'Seized Luxury Vehicles (2 Cars)',
    category: 'Vehicles',
    startDate: '2024-12-22',
    endDate: '2024-12-29',
    status: 'Live',
    startingBid: 500000,
    currentBid: 750000,
    totalBids: 8,
    highestBidder: 'AutoDealer Ltd.'
  },
  {
    id: '3',
    auctionNumber: 'AUC-2024-003',
    itemDescription: 'Industrial Machinery Parts',
    category: 'Industrial',
    startDate: '2024-12-25',
    endDate: '2025-01-02',
    status: 'Upcoming',
    startingBid: 100000,
    currentBid: 100000,
    totalBids: 0
  },
  {
    id: '4',
    auctionNumber: 'AUC-2023-045',
    itemDescription: 'Confiscated Jewelry and Watches',
    category: 'Jewelry',
    startDate: '2023-12-10',
    endDate: '2023-12-17',
    status: 'Closed',
    startingBid: 200000,
    currentBid: 450000,
    totalBids: 23,
    highestBidder: 'Luxury Gems Inc.'
  },
  {
    id: '5',
    auctionNumber: 'AUC-2024-004',
    itemDescription: 'Furniture and Household Items',
    category: 'Household',
    startDate: '2024-12-15',
    endDate: '2024-12-22',
    status: 'Closed',
    startingBid: 25000,
    currentBid: 35000,
    totalBids: 5,
    highestBidder: 'HomeMart'
  },
  {
    id: '6',
    auctionNumber: 'AUC-2024-005',
    itemDescription: 'Textile and Fabric Materials',
    category: 'Textiles',
    startDate: '2024-12-18',
    endDate: '2024-12-20',
    status: 'Cancelled',
    startingBid: 75000,
    currentBid: 75000,
    totalBids: 0
  }
];

export interface AuctionActivity {
  id: string;
  description: string;
  timestamp: Date;
  type: 'bid' | 'start' | 'end' | 'winner';
}

export const mockActivities: AuctionActivity[] = [
  {
    id: '1',
    description: 'New bid placed on AUC-2024-001 - ₹125,000',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'bid'
  },
  {
    id: '2',
    description: 'Auction started: AUC-2024-002',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'start'
  },
  {
    id: '3',
    description: 'New bid placed on AUC-2024-002 - ₹750,000',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: 'bid'
  },
  {
    id: '4',
    description: 'Auction ended: AUC-2024-004 - Winner: HomeMart',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'winner'
  }
];
