import { Order } from '../types';
import { Plus } from 'lucide-react';

interface OrderConfirmedProps {
  order: Order;
  onBack: () => void;
}

export default function OrderConfirmed({ order, onBack }: OrderConfirmedProps) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full font-medium text-sm">
          Your Order
        </div>
      </div>

      <div className="flex justify-between items-start text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">
        <div>
          <div className="mb-1">Table No : {order.tableNo}</div>
          <div>Total Items : {totalItems}</div>
        </div>
        <div>
          Order ID : {order.id}
        </div>
      </div>

      {/* Order List */}
      <div className="bg-[#FFF0F0] dark:bg-zinc-800/80 rounded-2xl overflow-hidden mb-6">
        <div className="bg-red-50 dark:bg-zinc-800 px-5 py-4 border-b border-red-100 dark:border-zinc-700">
          <h2 className="font-bold text-gray-900 dark:text-white">Your Order</h2>
        </div>
        
        <div className="p-5 flex flex-col gap-4">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-start">
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                {item.menuItem.name}
              </span>
              <span className="text-gray-900 dark:text-white text-sm font-medium whitespace-nowrap ml-4">
                {item.quantity}x
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onBack}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-colors text-sm shadow-sm"
        >
          <Plus size={18} />
          Add Order
        </button>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-t border-gray-100 dark:border-zinc-800 p-4">
        <button 
          onClick={() => alert("Bill requested! A staff member will be with you shortly.")}
          className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full transition-colors shadow-sm text-lg"
        >
          Request Bill
        </button>
      </div>
    </div>
  );
}
