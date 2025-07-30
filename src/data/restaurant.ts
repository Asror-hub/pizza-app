import { RestaurantInfo } from '../types';

export const restaurantInfo: RestaurantInfo = {
  name: "Pizza Palace Deluxe",
  address: "123 Main Street, Downtown, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "info@pizzapalacedeluxe.com",
  openingHours: {
    monday: "11:00 AM - 11:00 PM",
    tuesday: "11:00 AM - 11:00 PM",
    wednesday: "11:00 AM - 11:00 PM",
    thursday: "11:00 AM - 11:00 PM",
    friday: "11:00 AM - 12:00 AM",
    saturday: "11:00 AM - 12:00 AM",
    sunday: "12:00 PM - 10:00 PM"
  },
  deliveryRadius: 5, // 5 km
  minimumOrder: 15.00,
  deliveryFee: 2.99,
  averageDeliveryTime: 35 // 35 minutes
}; 