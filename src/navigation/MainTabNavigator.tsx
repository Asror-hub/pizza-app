import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { MainTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface MainTabNavigatorProps {
  cartItems: any[];
  onAddToCart: (pizza: any) => void;
  onUpdateQuantity: (pizzaId: string, quantity: number) => void;
  onRemoveItem: (pizzaId: string) => void;
  onCheckout: () => void;
}

const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.borderLight,
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 8,
          height: 85,
          shadowColor: theme.colors.shadowDark,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: theme.colors.textPrimary,
          fontWeight: theme.typography.fontWeight.bold,
        },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Menu' }}
        initialParams={{ onAddToCart }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ 
          title: 'Cart',
          tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,
        }}
        initialParams={{ 
          cartItems, 
          onUpdateQuantity, 
          onRemoveItem, 
          onCheckout 
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'My Orders' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Account' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 