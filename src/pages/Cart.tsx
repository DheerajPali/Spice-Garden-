import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { coupons } from '../data/mockData';
import CartItem from '../components/Cart/CartItem';
import Button from '../components/UI/Button';

const Cart: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const applyCoupon = () => {
    const coupon = coupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase() && 
      c.isActive && 
      new Date() < c.expiryDate &&
      totalAmount >= c.minOrderAmount
    );

    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setCouponError('Invalid or expired coupon code');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.discountType === 'percentage') {
      const discount = (totalAmount * appliedCoupon.discountValue) / 100;
      return appliedCoupon.maxDiscount ? Math.min(discount, appliedCoupon.maxDiscount) : discount;
    } else {
      return appliedCoupon.discountValue;
    }
  };

  const discount = calculateDiscount();
  const finalAmount = totalAmount - discount;
  const deliveryFee = finalAmount > 300 ? 0 : 40;
  const grandTotal = finalAmount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <Button onClick={() => navigate('/')}>
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
              <Button variant="danger" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

            {/* Coupon Section */}
            <div className="mb-6">
              <div className="flex space-x-2 mb-2">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <Button onClick={applyCoupon} size="sm">
                  Apply
                </Button>
              </div>
              
              {couponError && (
                <p className="text-red-500 text-sm">{couponError}</p>
              )}
              
              {appliedCoupon && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-green-800">{appliedCoupon.code} Applied!</p>
                    <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-green-600 hover:text-green-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{totalAmount}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              
              {finalAmount <= 300 && (
                <p className="text-sm text-gray-500">
                  Add ₹{(300 - finalAmount)} more for free delivery!
                </p>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              className="w-full"
              size="lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;