import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, Package, Truck, ChefHat, CheckCircle } from 'lucide-react';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Filter orders for current user (if logged in) or show all for guests
    const userOrders = user 
      ? savedOrders.filter((order: Order) => order.userId === user.id)
      : savedOrders;
    setOrders(userOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Package className="h-5 w-5" />;
      case 'preparing': return <ChefHat className="h-5 w-5" />;
      case 'out-for-delivery': return <Truck className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getActiveOrders = () => orders.filter(order => 
    ['confirmed', 'preparing', 'out-for-delivery'].includes(order.status)
  );

  const getPastOrders = () => orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  const activeOrders = getActiveOrders();
  const pastOrders = getPastOrders();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Your order history will appear here</p>
        </div>
      </div>
    );
  }

  const OrderCard = ({ order, isActive = false }: { order: Order; isActive?: boolean }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order.id}
          </h3>
          <p className="text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          {getStatusIcon(order.status)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>
      </div>

      {/* Progress Bar for Active Orders */}
      {isActive && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: order.status === 'confirmed' ? '25%' : 
                       order.status === 'preparing' ? '50%' : 
                       order.status === 'out-for-delivery' ? '75%' : '0%' 
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Confirmed</span>
            <span>Preparing</span>
            <span>On the way</span>
            <span>Delivered</span>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Items Ordered:</h4>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <span className="text-sm text-gray-600">
                  {item.name} × {item.quantity}
                </span>
              </div>
              <span className="text-sm font-medium">
                ₹{(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4 border-t">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Delivery Address</p>
            <p className="text-sm text-gray-600">
              {order.deliveryAddress.street}<br/>
              {order.deliveryAddress.city}, {order.deliveryAddress.state}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {order.status === 'delivered' ? 'Delivered At' : 'Estimated Delivery'}
            </p>
            <p className="text-sm text-gray-600">
              {order.status === 'delivered' && order.deliveredAt
                ? new Date(order.deliveredAt).toLocaleString()
                : `${order.estimatedMinutes || 30} mins`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="font-medium text-gray-900">Total Amount</span>
        <span className="text-lg font-semibold text-gray-900">
          ₹{order.totalAmount}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Orders</h2>
            <div className="space-y-6">
              {activeOrders.map(order => (
                <OrderCard key={order.id} order={order} isActive={true} />
              ))}
            </div>
          </div>
        )}

        {/* Past Orders */}
        {pastOrders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Orders</h2>
            <div className="space-y-6">
              {pastOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;