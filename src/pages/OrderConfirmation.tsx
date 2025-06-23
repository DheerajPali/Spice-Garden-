import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Phone, Package, Truck, ChefHat } from 'lucide-react';
import { Order } from '../types';
import Button from '../components/UI/Button';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = savedOrders.find((o: Order) => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order not found</h2>
          <Link to="/">
            <Button>Return to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Package className="h-6 w-6 text-blue-500" />;
      case 'preparing': return <ChefHat className="h-6 w-6 text-orange-500" />;
      case 'out-for-delivery': return <Truck className="h-6 w-6 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-6 w-6 text-green-500" />;
      default: return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Order Confirmed';
      case 'preparing': return 'Being Prepared';
      case 'out-for-delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return 'Processing';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We'll prepare it with care.
          </p>
        </div>

        {/* Order Status Card - Swiggy Style */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(order.status)}
              <div>
                <h3 className="font-semibold text-gray-900">{getStatusText(order.status)}</h3>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Estimated delivery</p>
              <p className="font-semibold text-orange-600">
                {order.estimatedMinutes} mins
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: order.status === 'confirmed' ? '25%' : 
                       order.status === 'preparing' ? '50%' : 
                       order.status === 'out-for-delivery' ? '75%' : 
                       order.status === 'delivered' ? '100%' : '0%' 
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

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>

          {/* Order Items */}
          <div className="space-y-3 mb-6">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">
                  ₹{(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Delivery Address</p>
                <p className="text-gray-600">
                  {order.deliveryAddress.street}<br/>
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Contact</p>
                <p className="text-gray-600">{order.customerPhone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">
                  {order.status === 'delivered' ? 'Delivered At' : 'Estimated Delivery'}
                </p>
                <p className="text-gray-600">
                  {order.status === 'delivered' && order.deliveredAt
                    ? new Date(order.deliveredAt).toLocaleString()
                    : new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/orders" className="flex-1">
            <Button variant="outline" className="w-full">
              Track Order
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button className="w-full">
              Order Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;