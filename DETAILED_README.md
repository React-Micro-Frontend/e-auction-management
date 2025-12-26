# E-Auction Management - Remote Application

## 🏛️ Overview

The **E-Auction Management** micro frontend handles the electronic auction system for customs-related items. It manages auction creation, bidding, and auction lifecycle management.

### Role in Architecture
- **Remote Application**: Consumed by shell application
- **Domain**: Electronic auction operations
- **Shared Modules**: Exposes auction components

---

## 🏗️ Architecture

### Folder Structure
```
src/
├── components/
│   ├── AuctionList.tsx         # Auction listing with filters
│   ├── AuctionDetail.tsx       # Auction details view
│   ├── CreateAuction.tsx       # Create auction form
│   ├── BidForm.tsx             # Bid submission form
│   ├── BidHistory.tsx          # Bid history timeline
│   ├── AuctionCard.tsx         # Auction preview card
│   ├── AuctionTimer.tsx        # Countdown timer component
│   └── index.ts                # Component exports
├── config/
│   └── module.config.ts        # Module configuration
│       - API endpoints
│       - Auction rules
│       - Business logic settings
├── data/
│   ├── mockAuctions.ts         # Mock auction data
│   ├── auctionColumns.ts       # Table column definitions
│   └── auctionStatuses.ts      # Auction status configurations
├── services/
│   ├── auctionService.ts       # Auction CRUD operations
│   │   - getAuctions()
│   │   - getAuctionById()
│   │   - createAuction()
│   │   - updateAuction()
│   │   - closeAuction()
│   ├── bidService.ts           # Bidding operations
│   │   - submitBid()
│   │   - getBidHistory()
│   │   - validateBid()
│   └── index.ts                # Service exports
├── types/
│   ├── Auction.ts              # Auction type definitions
│   │   interface Auction {
│   │     id: string;
│   │     title: string;
│   │     description: string;
│   │     status: AuctionStatus;
│   │     startDate: Date;
│   │     endDate: Date;
│   │     startingPrice: number;
│   │     currentBid: number;
│   │     bids: Bid[];
│   │   }
│   ├── Bid.ts                  # Bid type definitions
│   └── index.ts                # Type exports
├── utils/
│   ├── auctionValidation.ts    # Auction form validation
│   ├── bidCalculations.ts      # Bid increment calculations
│   ├── dateHelpers.ts          # Date/time utilities
│   └── index.ts                # Utility exports
├── App.tsx                     # Main application component
├── Bootstrap.tsx               # Module initialization
├── index.tsx                   # Entry point
└── remotes.d.ts                # Remote type definitions
```

---

## 🔌 Module Federation

### Exposed Modules
```javascript
exposes: {
  "./EAuctionManagement": "./src/App.tsx",
  "./AuctionList": "./src/components/AuctionList.tsx",
  "./AuctionCard": "./src/components/AuctionCard.tsx"
}
```

### Consumed Modules (from Shell)
```javascript
// Shared components
import { PageHeader, Card, Button, StatCard } from 'customMain/components/shared';

// Shared store
import { useAppSelector, useAppDispatch } from 'customMain/store/hooks';

// Styles
import 'customMain/TailwindStyles';
```

---

## 💡 Implementation Examples

### Auction List Component
```typescript
// src/components/AuctionList.tsx
import React, { useEffect, useState } from 'react';
import { PageHeader, Card, StatCard } from 'customMain/components/shared';
import { auctionService } from '../services';
import type { Auction, AuctionStatus } from '../types';
import AuctionCard from './AuctionCard';

const AuctionList: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filter, setFilter] = useState<AuctionStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadAuctions();
  }, [filter]);

  const loadAuctions = async () => {
    const data = await auctionService.getAuctions(filter);
    setAuctions(data);
  };

  const activeCount = auctions.filter(a => a.status === 'ACTIVE').length;
  const upcomingCount = auctions.filter(a => a.status === 'UPCOMING').length;
  const closedCount = auctions.filter(a => a.status === 'CLOSED').length;

  return (
    <div className="p-6">
      <PageHeader 
        title="E-Auction Management" 
        subtitle="Browse and participate in customs auctions"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatCard
          title="Active Auctions"
          value={activeCount}
          description="Currently open for bidding"
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <StatCard
          title="Upcoming Auctions"
          value={upcomingCount}
          description="Starting soon"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Closed Auctions"
          value={closedCount}
          description="Completed auctions"
          bgColor="bg-gray-50"
          textColor="text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {auctions.map(auction => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default AuctionList;
```

### Auction Service Implementation
```typescript
// src/services/auctionService.ts
import { apiService } from 'customMain/services';
import type { Auction, CreateAuctionDTO, AuctionStatus } from '../types';

export const auctionService = {
  async getAuctions(status?: AuctionStatus | 'ALL'): Promise<Auction[]> {
    const params = status !== 'ALL' ? { status } : {};
    const response = await apiService.get('/auctions', { params });
    return response.data;
  },

  async getAuctionById(id: string): Promise<Auction> {
    const response = await apiService.get(`/auctions/${id}`);
    return response.data;
  },

  async createAuction(auction: CreateAuctionDTO): Promise<Auction> {
    const response = await apiService.post('/auctions', auction);
    return response.data;
  },

  async updateAuction(id: string, updates: Partial<Auction>): Promise<Auction> {
    const response = await apiService.put(`/auctions/${id}`, updates);
    return response.data;
  },

  async closeAuction(id: string): Promise<void> {
    await apiService.post(`/auctions/${id}/close`);
  }
};
```

### Bid Service Implementation
```typescript
// src/services/bidService.ts
import { apiService } from 'customMain/services';
import type { Bid, SubmitBidDTO } from '../types';

export const bidService = {
  async getBidHistory(auctionId: string): Promise<Bid[]> {
    const response = await apiService.get(`/auctions/${auctionId}/bids`);
    return response.data;
  },

  async submitBid(bid: SubmitBidDTO): Promise<Bid> {
    const response = await apiService.post('/bids', bid);
    return response.data;
  },

  async validateBid(auctionId: string, amount: number): Promise<boolean> {
    const response = await apiService.post('/bids/validate', {
      auctionId,
      amount
    });
    return response.data.valid;
  }
};
```

### Type Definitions
```typescript
// src/types/Auction.ts
export enum AuctionStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  itemDetails: string;
  status: AuctionStatus;
  startDate: Date;
  endDate: Date;
  startingPrice: number;
  currentBid: number;
  minimumIncrement: number;
  totalBids: number;
  createdBy: string;
  createdAt: Date;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface CreateAuctionDTO {
  title: string;
  description: string;
  itemDetails: string;
  startDate: Date;
  endDate: Date;
  startingPrice: number;
  minimumIncrement: number;
}

export interface SubmitBidDTO {
  auctionId: string;
  amount: number;
}
```

### Auction Timer Component
```typescript
// src/components/AuctionTimer.tsx
import React, { useEffect, useState } from 'react';

interface Props {
  endDate: Date;
  onExpire?: () => void;
}

const AuctionTimer: React.FC<Props> = ({ endDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        onExpire?.();
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  return (
    <div className="text-lg font-mono font-semibold text-red-600">
      {timeLeft}
    </div>
  );
};

export default AuctionTimer;
```

---

## 🚀 Getting Started

### Development
```bash
npm install
npm start
# Runs on http://localhost:5002
```

### Build
```bash
npm run build
```

---

## 🔗 Integration with Shell

### Routing
```typescript
// Shell loads at /e-auction
<Route path="/e-auction" element={<EAuctionManagement />} />
```

### State Sharing
```typescript
// Access current user for bidding
const currentUser = useAppSelector(state => state.user);
```

---

## 📦 Dependencies

### Remote Dependencies
- `customMain/components/shared` - UI components
- `customMain/store` - Redux store
- `customMain/services` - API service
- `customMain/TailwindStyles` - Styles

---

## 🔗 Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall architecture
- [custom-main README](../custom-main/README.md) - Shell documentation

