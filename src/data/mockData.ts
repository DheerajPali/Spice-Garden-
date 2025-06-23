import { MenuItem, Coupon, Order } from '../types';

export const menuItems: MenuItem[] = [
  // North Indian Curries
  {
    id: '1',
    name: 'Paneer Butter Masala',
    description: 'Rich and creamy paneer curry with tomato-based gravy, butter, and aromatic spices',
    price: 280,
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'curries',
    available: true,
    preparationTime: 20
  },
  {
    id: '2',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils with butter, cream, and traditional spices',
    price: 220,
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'curries',
    available: true,
    preparationTime: 25
  },
  {
    id: '3',
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken pieces in creamy tomato-based curry with Indian spices',
    price: 350,
    image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'curries',
    available: true,
    preparationTime: 30
  },
  {
    id: '4',
    name: 'Palak Paneer',
    description: 'Fresh spinach curry with soft paneer cubes and aromatic spices',
    price: 260,
    image: 'https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'curries',
    available: true,
    preparationTime: 22
  },
  {
    id: '5',
    name: 'Rajma Masala',
    description: 'Red kidney beans cooked in thick tomato-onion gravy with traditional spices',
    price: 200,
    image: 'https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'curries',
    available: true,
    preparationTime: 25
  },

  // Rice & Biryani
  {
    id: '6',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice layered with spiced chicken, saffron, and fried onions',
    price: 380,
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'rice',
    available: true,
    preparationTime: 35
  },
  {
    id: '7',
    name: 'Mutton Biryani',
    description: 'Premium basmati rice with tender mutton pieces, aromatic spices, and saffron',
    price: 450,
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'rice',
    available: true,
    preparationTime: 40
  },
  {
    id: '8',
    name: 'Veg Biryani',
    description: 'Aromatic basmati rice with mixed vegetables, paneer, and traditional spices',
    price: 280,
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'rice',
    available: true,
    preparationTime: 30
  },
  {
    id: '9',
    name: 'Jeera Rice',
    description: 'Fragrant basmati rice tempered with cumin seeds and ghee',
    price: 150,
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'rice',
    available: true,
    preparationTime: 15
  },

  // Breads
  {
    id: '10',
    name: 'Butter Naan',
    description: 'Soft, fluffy bread brushed with butter and cooked in tandoor',
    price: 60,
    image: 'https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'breads',
    available: true,
    preparationTime: 12
  },
  {
    id: '11',
    name: 'Garlic Naan',
    description: 'Tandoor-baked bread topped with fresh garlic and coriander',
    price: 80,
    image: 'https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'breads',
    available: true,
    preparationTime: 12
  },
  {
    id: '12',
    name: 'Tandoori Roti',
    description: 'Whole wheat bread cooked in traditional tandoor oven',
    price: 40,
    image: 'https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'breads',
    available: true,
    preparationTime: 10
  },
  {
    id: '13',
    name: 'Stuffed Kulcha',
    description: 'Leavened bread stuffed with spiced potatoes and onions',
    price: 90,
    image: 'https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'breads',
    available: true,
    preparationTime: 15
  },

  // Starters
  {
    id: '14',
    name: 'Chicken Tikka',
    description: 'Marinated chicken pieces grilled in tandoor with yogurt and spices',
    price: 320,
    image: 'https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'starters',
    available: true,
    preparationTime: 25
  },
  {
    id: '15',
    name: 'Paneer Tikka',
    description: 'Marinated paneer cubes grilled with bell peppers and onions',
    price: 280,
    image: 'https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'starters',
    available: true,
    preparationTime: 20
  },
  {
    id: '16',
    name: 'Seekh Kebab',
    description: 'Spiced minced meat skewers grilled to perfection in tandoor',
    price: 350,
    image: 'https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'starters',
    available: true,
    preparationTime: 22
  },
  {
    id: '17',
    name: 'Samosa (2 pieces)',
    description: 'Crispy pastry filled with spiced potatoes and green peas',
    price: 60,
    image: 'https://images.pexels.com/photos/7218637/pexels-photo-7218637.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'starters',
    available: true,
    preparationTime: 15
  },

  // South Indian
  {
    id: '18',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato curry, served with chutney and sambar',
    price: 120,
    image: 'https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'south-indian',
    available: true,
    preparationTime: 18
  },
  {
    id: '19',
    name: 'Idli Sambar (4 pieces)',
    description: 'Steamed rice cakes served with lentil curry and coconut chutney',
    price: 80,
    image: 'https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'south-indian',
    available: true,
    preparationTime: 12
  },
  {
    id: '20',
    name: 'Uttapam',
    description: 'Thick rice pancake topped with vegetables and served with chutney',
    price: 100,
    image: 'https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'south-indian',
    available: true,
    preparationTime: 15
  },

  // Desserts
  {
    id: '21',
    name: 'Gulab Jamun (2 pieces)',
    description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
    price: 80,
    image: 'https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'desserts',
    available: true,
    preparationTime: 5
  },
  {
    id: '22',
    name: 'Rasmalai (2 pieces)',
    description: 'Soft cottage cheese dumplings in sweetened milk with cardamom',
    price: 100,
    image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'desserts',
    available: true,
    preparationTime: 5
  },
  {
    id: '23',
    name: 'Kulfi',
    description: 'Traditional Indian ice cream with cardamom and pistachios',
    price: 70,
    image: 'https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'desserts',
    available: true,
    preparationTime: 3
  },

  // Beverages
  {
    id: '24',
    name: 'Masala Chai',
    description: 'Traditional Indian tea with aromatic spices and milk',
    price: 30,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'beverages',
    available: true,
    preparationTime: 5
  },
  {
    id: '25',
    name: 'Lassi (Sweet/Salt)',
    description: 'Traditional yogurt-based drink, available in sweet or salted version',
    price: 60,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'beverages',
    available: true,
    preparationTime: 5
  },
  {
    id: '26',
    name: 'Fresh Lime Water',
    description: 'Refreshing lime juice with mint and black salt',
    price: 40,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'beverages',
    available: true,
    preparationTime: 3
  }
];

export const categories = [
  { id: 'starters', name: 'Starters', icon: '🥗' },
  { id: 'curries', name: 'Curries', icon: '🍛' },
  { id: 'rice', name: 'Rice & Biryani', icon: '🍚' },
  { id: 'breads', name: 'Breads', icon: '🫓' },
  { id: 'south-indian', name: 'South Indian', icon: '🥞' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' }
];

export const coupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    description: '10% off on first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 200,
    maxDiscount: 100,
    expiryDate: new Date('2024-12-31'),
    isActive: true,
    usageLimit: 100,
    usedCount: 25
  },
  {
    id: '2',
    code: 'SAVE50',
    description: '₹50 off on orders above ₹300',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 300,
    expiryDate: new Date('2024-12-31'),
    isActive: true,
    usageLimit: 200,
    usedCount: 89
  }
];

// Mock orders for demonstration
export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    customerName: 'Rajesh Kumar',
    customerEmail: 'rajesh@example.com',
    customerPhone: '+91-9876543210',
    items: [
      { ...menuItems[0], quantity: 2 },
      { ...menuItems[9], quantity: 3 }
    ],
    totalAmount: 740,
    deliveryAddress: {
      id: '1',
      label: 'Home',
      street: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      isDefault: true
    },
    status: 'preparing',
    paymentMethod: 'upi',
    createdAt: new Date('2024-01-15T10:30:00'),
    estimatedDeliveryTime: new Date('2024-01-15T11:15:00'),
    deliveredAt: undefined,
    notes: 'Please ring the doorbell'
  }
];