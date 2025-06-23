export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  preparationTime: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface WishlistItem extends MenuItem {}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  isAdmin?: boolean;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: Address;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  discount?: number;
  createdAt: Date;
  estimatedDeliveryTime: Date;
  deliveredAt?: Date;
  notes?: string;
  estimatedMinutes?: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'upi' | 'card' | 'wallet' | 'cod';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: Date;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  switchProfile: (userId: string) => void;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  getItemQuantity: (itemId: string) => number;
}

export interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
}

export interface RestaurantSettings {
  name: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  workingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

export interface Notification {
  id: string;
  type: 'order_placed' | 'order_updated' | 'order_delivered' | 'new_order';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  orderId?: string;
  userId?: string;
  isForAdmin?: boolean;
}

export interface KitchenItem {
  itemId: string;
  itemName: string;
  totalQuantity: number;
  orders: {
    orderId: string;
    quantity: number;
    customerName: string;
    orderTime: Date;
  }[];
}