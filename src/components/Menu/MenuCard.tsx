import React, { useState } from 'react';
import { Plus, Clock, Minus, Heart } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const cartQuantity = getItemQuantity(item.id);
  const inWishlist = isInWishlist(item.id);

  const handleAddToCart = () => {
    addItem(item);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, cartQuantity + 1);
  };

  const handleDecrement = () => {
    if (cartQuantity > 1) {
      updateQuantity(item.id, cartQuantity - 1);
    } else {
      // Show wishlist modal when removing last item
      setShowWishlistModal(true);
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const handleRemoveFromCart = () => {
    updateQuantity(item.id, 0);
    setShowWishlistModal(false);
  };

  const handleAddToWishlistAndRemove = () => {
    addToWishlist(item);
    updateQuantity(item.id, 0);
    setShowWishlistModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!item.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-sm font-medium text-gray-700 shadow-md">
            ₹{item.price}
          </div>
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-colors ${
              inWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {item.preparationTime} mins
            </div>
            
            {cartQuantity > 0 ? (
              <div className="flex items-center space-x-3 bg-orange-50 rounded-lg px-3 py-2">
                <button
                  onClick={handleDecrement}
                  className="p-1 rounded-full hover:bg-orange-100 transition-colors text-orange-600"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-semibold text-orange-600 min-w-[1.5rem] text-center">
                  {cartQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={!item.available}
                  className="p-1 rounded-full hover:bg-orange-100 transition-colors text-orange-600 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={!item.available}
                className="flex items-center space-x-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            )}
          </div>
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

export default MenuCard;