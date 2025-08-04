export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any; // Can be string URL or require() statement
  category: 'classic' | 'premium' | 'vegetarian' | 'spicy';
  ingredients: string[];
  size: 'small' | 'medium' | 'large';
  isAvailable: boolean;
  preparationTime: number; // in minutes
}

export interface CartItem {
  pizza: Pizza;
  quantity: number;
  size: 'small' | 'medium' | 'large';
  specialInstructions?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  orderDate: Date;
  estimatedDeliveryTime: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'online';
  specialInstructions?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  favoritePizzas: string[]; // pizza IDs
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    [key: string]: string; // day: hours
  };
  deliveryRadius: number; // in km
  minimumOrder: number;
  deliveryFee: number;
  averageDeliveryTime: number; // in minutes
} 