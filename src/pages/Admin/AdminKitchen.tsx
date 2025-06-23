import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, User } from 'lucide-react';
import { Order, KitchenItem } from '../../types';

const AdminKitchen: React.FC = () => {
  const [kitchenItems, setKitchenItems] = useState<KitchenItem[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Filter orders that need preparation (confirmed and preparing)
    const activeOrders = savedOrders.filter((order: Order) => 
      ['confirmed', 'preparing'].includes(order.status)
    );

    // Group items by itemId and calculate total quantities
    const itemsMap = new Map<string, KitchenItem>();

    activeOrders.forEach((order: Order) => {
      order.items.forEach(item => {
        const existingItem = itemsMap.get(item.id);
        
        if (existingItem) {
          existingItem.totalQuantity += item.quantity;
          existingItem.orders.push({
            orderId: order.id,
            quantity: item.quantity,
            customerName: order.customerName,
            orderTime: new Date(order.createdAt)
          });
        } else {
          itemsMap.set(item.id, {
            itemId: item.id,
            itemName: item.name,
            totalQuantity: item.quantity,
            orders: [{
              orderId: order.id,
              quantity: item.quantity,
              customerName: order.customerName,
              orderTime: new Date(order.createdAt)
            }]
          });
        }
      });
    });

    // Sort orders within each item by time
    itemsMap.forEach(item => {
      item.orders.sort((a, b) => a.orderTime.getTime() - b.orderTime.getTime());
    });

    setKitchenItems(Array.from(itemsMap.values()));
  }, []);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ${diffInMinutes % 60}m ago`;
  };

  if (kitchenItems.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Kitchen Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No items to prepare</h2>
          <p className="text-gray-600">All orders are completed or no active orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Kitchen Dashboard</h1>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
          <span className="font-semibold">{kitchenItems.length}</span> items to prepare
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kitchenItems.map(item => (
          <div key={item.itemId} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ChefHat className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
                  <p className="text-sm text-gray-600">Total quantity needed</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-orange-600">{item.totalQuantity}</span>
                <p className="text-sm text-gray-600">portions</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 mb-2">Order Details:</h4>
              {item.orders.map(order => (
                <div key={`${order.orderId}-${item.itemId}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">×{order.quantity}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeAgo(order.orderTime)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Priority:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.orders.some(o => getTimeAgo(o.orderTime).includes('h')) 
                    ? 'bg-red-100 text-red-800' 
                    : item.orders.some(o => parseInt(getTimeAgo(o.orderTime)) > 15)
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.orders.some(o => getTimeAgo(o.orderTime).includes('h')) 
                    ? 'High' 
                    : item.orders.some(o => parseInt(getTimeAgo(o.orderTime)) > 15)
                    ? 'Medium'
                    : 'Normal'
                  }
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminKitchen;