import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../../components/UI/Button';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const { addNotification } = useNotifications();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (newStatus === 'delivered') {
          updatedOrder.deliveredAt = new Date();
        }
        return updatedOrder;
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Find the order to get customer info
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Send notification to customer
      addNotification({
        type: 'order_updated',
        title: 'Order Status Updated',
        message: `Your order #${orderId} is now ${newStatus.replace('-', ' ')}`,
        orderId: orderId,
        userId: order.userId
      });
    }
  };

  const updateEstimatedTime = (orderId: string, minutes: number) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { 
          ...order, 
          estimatedMinutes: minutes,
          estimatedDeliveryTime: new Date(Date.now() + minutes * 60 * 1000)
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Find the order to get customer info
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Send notification to customer
      addNotification({
        type: 'order_updated',
        title: 'Delivery Time Updated',
        message: `Your order #${orderId} will be delivered in ${minutes} minutes`,
        orderId: orderId,
        userId: order.userId
      });
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

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

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="out-for-delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
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
                    {order.deliveredAt && (
                      <p className="text-sm text-green-600">
                        Delivered at: {new Date(order.deliveredAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      {expandedOrders.has(order.id) ? 
                        <ChevronUp className="h-5 w-5" /> : 
                        <ChevronDown className="h-5 w-5" />
                      }
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-600">{order.customerPhone}</p>
                    </div>
                  </div>

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
                        {order.status === 'delivered' ? 'Delivered' : 'Est. Delivery'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.status === 'delivered' && order.deliveredAt
                          ? new Date(order.deliveredAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })
                          : `${order.estimatedMinutes || 30} mins`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estimated Time Update */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Estimated Delivery Time:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="10"
                        max="120"
                        defaultValue={order.estimatedMinutes || 30}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        onBlur={(e) => {
                          const minutes = parseInt(e.target.value);
                          if (minutes >= 10 && minutes <= 120) {
                            updateEstimatedTime(order.id, minutes);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-600">minutes</span>
                    </div>
                  </div>
                )}

                {expandedOrders.has(order.id) && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Order Items:</h4>
                    <div className="space-y-2 mb-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-gray-600">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ₹{(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {order.notes && (
                      <div className="mb-4">
                        <p className="font-medium text-gray-900">Special Instructions:</p>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    {getNextStatus(order.status) && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                        size="sm"
                      >
                        Mark as {getNextStatus(order.status)?.replace('-', ' ')}
                      </Button>
                    )}
                    
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        variant="danger"
                        size="sm"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                  
                  <span className="text-lg font-semibold text-gray-900">
                    Total: ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;