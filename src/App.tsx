import React from "react";
import { Card, PageHeader, StatCard, Button } from "customMain/components/shared";
import { useAppDispatch, useAppSelector } from "customMain/store/hooks";
import { increment, decrement, reset } from "customMain/store/slices/counterSlice";
import { addUser } from "customMain/store/slices/userSlice";
import { formatRelativeTime, formatDate, formatCurrency } from "customMain/utils/dateHelpers";
import { mockAuctions, mockActivities } from "./data/mockData";

export default function App() {
  const dispatch = useAppDispatch();
  const counter = useAppSelector((state) => state.counter);
  const users = useAppSelector((state) => state.users);

  const handleAddAuctioneer = () => {
    const randomId = Math.random().toString(36).substr(2, 9);
    dispatch(addUser({
      id: randomId,
      name: `Auctioneer ${randomId}`,
      email: `auctioneer${randomId}@customs.gov`,
      role: 'Auctioneer',
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'text-green-600 bg-green-100';
      case 'Upcoming': return 'text-blue-600 bg-blue-100';
      case 'Closed': return 'text-gray-600 bg-gray-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const liveAuctions = mockAuctions.filter(a => a.status === 'Live').length;
  const upcomingAuctions = mockAuctions.filter(a => a.status === 'Upcoming').length;
  const totalBids = mockAuctions.reduce((sum, a) => sum + a.totalBids, 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <PageHeader 
        title="E-Auction Management Module" 
        description="Manage customs auctions and bidding with real-time state synchronization" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Live Auctions" value={liveAuctions.toString()} icon="🔨" color="emerald" />
        <StatCard title="Upcoming" value={upcomingAuctions.toString()} icon="📅" color="blue" />
        <StatCard title="Total Bids" value={totalBids.toString()} icon="💰" color="orange" />
        <StatCard title="Counter (Shared)" value={counter.value.toString()} icon="🔢" color="purple" />
      </div>

      {/* Shared Redux Counter Demo */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Shared Redux Counter</h2>
        <p className="text-gray-600 mb-4">
          This counter syncs across all micro-frontends in real-time
          <br />
          <span className="font-semibold text-purple-600">Current Count: {counter.value}</span>
        </p>
        <div className="flex gap-4">
          <Button variant="primary" onClick={() => dispatch(increment())}>
            Increment from Auction Module
          </Button>
          <Button variant="secondary" onClick={() => dispatch(decrement())}>
            Decrement
          </Button>
          <Button variant="danger" onClick={() => dispatch(reset())}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Shared Users */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Shared User Store</h2>
        <p className="text-gray-600 mb-4">
          Total System Users: <span className="font-semibold text-emerald-600">{users.totalCount}</span>
        </p>
        <Button variant="success" onClick={handleAddAuctioneer}>
          Add Auctioneer
        </Button>
      </Card>

      {/* Auction Records Table */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Auction Listings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">Auction No.</th>
                <th className="text-left p-3 font-semibold text-gray-700">Item Description</th>
                <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                <th className="text-left p-3 font-semibold text-gray-700">Start Date</th>
                <th className="text-left p-3 font-semibold text-gray-700">End Date</th>
                <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                <th className="text-left p-3 font-semibold text-gray-700">Current Bid</th>
                <th className="text-left p-3 font-semibold text-gray-700">Total Bids</th>
              </tr>
            </thead>
            <tbody>
              {mockAuctions.map((auction) => (
                <tr key={auction.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{auction.auctionNumber}</td>
                  <td className="p-3">{auction.itemDescription}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                      {auction.category}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(auction.startDate)}</td>
                  <td className="p-3">{formatDate(auction.endDate)}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auction.status)}`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    {formatCurrency(auction.currentBid)}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {auction.totalBids}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Auction Activity</h3>
        <div className="space-y-3">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {activity.type === 'bid' ? '💰' : activity.type === 'start' ? '🚀' : activity.type === 'end' ? '⏱️' : '🏆'}
                </span>
                <span className="text-gray-700">{activity.description}</span>
              </div>
              <span className="text-sm text-gray-500">{formatRelativeTime(activity.timestamp)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
