import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Modal from '../UI/Modal';
import Button from '../UI/Button';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { addItem: addToWishlist } = useWishlist();
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  const handleRemove = () => {
    setShowWishlistModal(true);
  };

  const handleRemoveFromCart = () => {
    removeItem(item.id);
    setShowWishlistModal(false);
  };

  const handleAddToWishlistAndRemove = () => {
    addToWishlist(item);
    removeItem(item.id);
    setShowWishlistModal(false);
  };

  return (
    <>
      <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <p className="text-gray-600 text-sm">₹{item.price} each</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
          
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            ₹{(item.price * item.quantity)}
          </p>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 transition-colors mt-1"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Wishlist Modal */}
      <Modal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        title="Remove from Cart"
        size="sm"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Would you like to add "{item.name}" to your wishlist before removing it from cart?
          </p>
          <div className="flex space-x-3">
            <Button
              onClick={handleRemoveFromCart}
              variant="outline"
              className="flex-1"
            >
              Just Remove
            </Button>
            <Button
              onClick={handleAddToWishlistAndRemove}
              className="flex-1"
            >
              Add to Wishlist
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CartItem;