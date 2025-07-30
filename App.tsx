import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, StyleSheet, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './src/styles/theme';
import { Pizza, CartItem, Order } from './src/types';
import { restaurantInfo } from './src/data/restaurant';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PizzaDetailsScreen from './src/screens/PizzaDetailsScreen';

// Suppress the useInsertionEffect warning from styled-components
LogBox.ignoreLogs(['Warning: useInsertionEffect must not schedule updates.']);

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'cart' | 'orders' | 'profile' | 'checkout'>('home');
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isPizzaDetailsVisible, setIsPizzaDetailsVisible] = useState(false);

  const addToCart = (pizza: Pizza, quantity: number = 1, size: 'small' | 'medium' | 'large' = 'medium') => {
    console.log('Adding to cart:', { pizza: pizza.name, quantity, size });
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.pizza.id === pizza.id && item.size === size
      );
      if (existingItem) {
        console.log('Updating existing item quantity');
        return prevItems.map(item =>
          item.pizza.id === pizza.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        console.log('Adding new item to cart');
        return [...prevItems, { pizza, quantity, size }];
      }
    });
  };

  const updateQuantity = (pizzaId: string, size: 'small' | 'medium' | 'large', quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.pizza.id === pizzaId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (pizzaId: string, size: 'small' | 'medium' | 'large') => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.pizza.id === pizzaId && item.size === size))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'estimatedDeliveryTime' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}`,
      orderDate: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + restaurantInfo.averageDeliveryTime * 60 * 1000),
      status: 'pending',
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
    setCurrentScreen('home');
  };

  const openPizzaDetails = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setIsPizzaDetailsVisible(true);
  };

  const closePizzaDetails = () => {
    setIsPizzaDetailsVisible(false);
    setSelectedPizza(null);
  };

  const renderScreen = () => {
    console.log('Current screen:', currentScreen);
    console.log('Cart items in render:', cartItems);
    
    let screenComponent;
    switch (currentScreen) {
      case 'home':
        screenComponent = (
          <HomeScreen 
            onAddToCart={addToCart}
            onCartPress={() => setCurrentScreen('cart')}
            onPizzaPress={openPizzaDetails}
            cartItemCount={cartItems.length}
          />
        );
        break;
      case 'cart':
        screenComponent = (
          <CartScreen
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => setCurrentScreen('checkout')}
            onBackPress={() => setCurrentScreen('home')}
          />
        );
        break;
      case 'orders':
        screenComponent = <OrdersScreen />;
        break;
      case 'profile':
        screenComponent = <ProfileScreen />;
        break;
      case 'checkout':
        screenComponent = (
          <CheckoutScreen
            cartItems={cartItems}
            onPlaceOrder={placeOrder}
            onGoBack={() => setCurrentScreen('cart')}
          />
        );
        break;
      default:
        screenComponent = (
          <HomeScreen 
            onAddToCart={addToCart}
            onCartPress={() => setCurrentScreen('cart')}
            onPizzaPress={openPizzaDetails}
            cartItemCount={cartItems.length}
          />
        );
    }

    return screenComponent;
  };

  const renderTabBar = () => {
    if (currentScreen === 'checkout') return null;

    return (
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons 
            name={currentScreen === 'home' ? 'restaurant' : 'restaurant-outline'} 
            size={24} 
            color={currentScreen === 'home' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.tabLabel,
            currentScreen === 'home' && styles.activeTab
          ]}>
            Menu
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentScreen('cart')}
        >
          <View style={styles.cartContainer}>
            <Ionicons 
              name={currentScreen === 'cart' ? 'cart' : 'cart-outline'} 
              size={24} 
              color={currentScreen === 'cart' ? theme.colors.primary : theme.colors.textSecondary} 
            />
            {cartItems.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItems.length}</Text>
              </View>
            )}
          </View>
          <Text style={[
            styles.tabLabel,
            currentScreen === 'cart' && styles.activeTab
          ]}>
            Cart
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentScreen('orders')}
        >
          <Ionicons 
            name={currentScreen === 'orders' ? 'receipt' : 'receipt-outline'} 
            size={24} 
            color={currentScreen === 'orders' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.tabLabel,
            currentScreen === 'orders' && styles.activeTab
          ]}>
            Orders
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentScreen('profile')}
        >
          <Ionicons 
            name={currentScreen === 'profile' ? 'person' : 'person-outline'} 
            size={24} 
            color={currentScreen === 'profile' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.tabLabel,
            currentScreen === 'profile' && styles.activeTab
          ]}>
            Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          {renderScreen()}
          {renderTabBar()}
          
          {/* Pizza Details Modal */}
          {selectedPizza && (
            <PizzaDetailsScreen
              pizza={selectedPizza}
              onAddToCart={addToCart}
              onGoBack={closePizzaDetails}
              visible={isPizzaDetailsVisible}
            />
          )}
        </View>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 10,
    paddingTop: 10,
    height: 80,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: theme.colors.textSecondary,
  },
  tabLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  activeTab: {
    color: theme.colors.primary,
  },
  cartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: theme.colors.textInverse,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
