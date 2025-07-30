import React, { useState, useRef } from 'react';
import { 
  FlatList, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { theme } from '../styles/theme';
import { Order, CartItem } from '../types';
import { 
  SafeContainer, 
  PaddingContainer, 
  Title, 
  BodyText, 
  CaptionText,
  Row,
  EmptyContainer,
  EmptyText
} from '../styles/styled';

const { width: screenWidth } = Dimensions.get('window');

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      {
        pizza: {
          id: '1',
          name: 'Margherita Classic',
          description: 'Fresh mozzarella, tomato sauce, and basil',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
          category: 'classic',
          ingredients: ['Mozzarella', 'Tomato Sauce', 'Basil'],
          size: 'medium',
          isAvailable: true,
          preparationTime: 15
        },
        quantity: 2,
        size: 'large'
      },
      {
        pizza: {
          id: '3',
          name: 'Pepperoni Supreme',
          description: 'Spicy pepperoni with melted cheese',
          price: 15.99,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          category: 'classic',
          ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce'],
          size: 'medium',
          isAvailable: true,
          preparationTime: 18
        },
        quantity: 1,
        size: 'medium'
      }
    ],
    totalAmount: 41.97,
    deliveryAddress: '123 Main St, Downtown, NY 10001',
    customerName: 'John Doe',
    customerPhone: '+1 (555) 123-4567',
    orderDate: new Date('2024-01-15T18:30:00'),
    estimatedDeliveryTime: new Date('2024-01-15T19:15:00'),
    status: 'out_for_delivery',
    paymentMethod: 'card',
    specialInstructions: 'Please ring doorbell twice'
  },
  {
    id: 'ORD-002',
    items: [
      {
        pizza: {
          id: '2',
          name: 'BBQ Chicken Deluxe',
          description: 'Grilled chicken with BBQ sauce and red onions',
          price: 16.99,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
          category: 'premium',
          ingredients: ['Grilled Chicken', 'BBQ Sauce', 'Red Onions', 'Mozzarella'],
          size: 'medium',
          isAvailable: true,
          preparationTime: 20
        },
        quantity: 1,
        size: 'large'
      }
    ],
    totalAmount: 22.09,
    deliveryAddress: '456 Oak Ave, Uptown, NY 10002',
    customerName: 'Jane Smith',
    customerPhone: '+1 (555) 987-6543',
    orderDate: new Date('2024-01-14T20:15:00'),
    estimatedDeliveryTime: new Date('2024-01-14T21:00:00'),
    status: 'delivered',
    paymentMethod: 'online'
  },
  {
    id: 'ORD-003',
    items: [
      {
        pizza: {
          id: '4',
          name: 'Veggie Supreme',
          description: 'Fresh vegetables with mozzarella cheese',
          price: 14.99,
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
          category: 'vegetarian',
          ingredients: ['Bell Peppers', 'Mushrooms', 'Onions', 'Olives', 'Mozzarella'],
          size: 'medium',
          isAvailable: true,
          preparationTime: 16
        },
        quantity: 1,
        size: 'medium'
      }
    ],
    totalAmount: 19.99,
    deliveryAddress: '789 Pine St, Midtown, NY 10003',
    customerName: 'Mike Johnson',
    customerPhone: '+1 (555) 456-7890',
    orderDate: new Date('2024-01-13T19:45:00'),
    estimatedDeliveryTime: new Date('2024-01-13T20:30:00'),
    status: 'delivered',
    paymentMethod: 'cash'
  },
  {
    id: 'ORD-004',
    items: [
      {
        pizza: {
          id: '5',
          name: 'Spicy Jalapeño',
          description: 'Hot jalapeños with pepperoni and cheese',
          price: 17.99,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          category: 'spicy',
          ingredients: ['Jalapeños', 'Pepperoni', 'Mozzarella', 'Hot Sauce'],
          size: 'medium',
          isAvailable: true,
          preparationTime: 18
        },
        quantity: 2,
        size: 'large'
      }
    ],
    totalAmount: 46.77,
    deliveryAddress: '321 Elm St, Downtown, NY 10004',
    customerName: 'Sarah Wilson',
    customerPhone: '+1 (555) 321-6540',
    orderDate: new Date('2024-01-12T21:00:00'),
    estimatedDeliveryTime: new Date('2024-01-12T21:45:00'),
    status: 'delivered',
    paymentMethod: 'card'
  }
];

const OrdersContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const HeaderContainer = styled.View`
  padding: ${theme.spacing.sm}px ${theme.spacing.lg}px;
  background-color: ${theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.borderLight};
  margin-bottom: -15px;
`;

const OrdersTitle = styled(Title)`
  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${theme.spacing.lg}px;
  background-color: ${theme.colors.backgroundSecondary};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.xs}px;
`;

const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.md}px;
  background-color: ${(props: { active: boolean }) => 
    props.active ? theme.colors.primary : 'transparent'
  };
  align-items: center;
  margin: 0 ${theme.spacing.xs}px;
`;

const FilterButtonText = styled.Text<{ active: boolean }>`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${(props: { active: boolean }) => 
    props.active ? theme.colors.textInverse : theme.colors.textSecondary
  };
`;

const OrderCard = styled.TouchableOpacity`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.md}px;
  shadow-color: rgba(0, 0, 0, 0.08);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 2;
`;

const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md}px;
`;

const OrderInfo = styled.View`
  flex: 1;
`;

const OrderId = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const OrderDate = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const OrderAmount = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const StatusBadge = styled.View<{ status: Order['status'] }>`
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.round}px;
  background-color: ${(props: { status: Order['status'] }) => {
    switch (props.status) {
      case 'pending': return theme.colors.warning + '20';
      case 'confirmed': return theme.colors.info + '20';
      case 'preparing': return theme.colors.primary + '20';
      case 'out_for_delivery': return theme.colors.accent + '20';
      case 'delivered': return theme.colors.success + '20';
      case 'cancelled': return theme.colors.error + '20';
      default: return theme.colors.textTertiary + '20';
    }
  }};
  border: 1px solid ${(props: { status: Order['status'] }) => {
    switch (props.status) {
      case 'pending': return theme.colors.warning + '40';
      case 'confirmed': return theme.colors.info + '40';
      case 'preparing': return theme.colors.primary + '40';
      case 'out_for_delivery': return theme.colors.accent + '40';
      case 'delivered': return theme.colors.success + '40';
      case 'cancelled': return theme.colors.error + '40';
      default: return theme.colors.textTertiary + '40';
    }
  }};
`;

const StatusText = styled.Text<{ status: Order['status'] }>`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props: { status: Order['status'] }) => {
    switch (props.status) {
      case 'pending': return theme.colors.warning;
      case 'confirmed': return theme.colors.info;
      case 'preparing': return theme.colors.primary;
      case 'out_for_delivery': return theme.colors.accent;
      case 'delivered': return theme.colors.success;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  }};
`;

const OrderItems = styled.View`
  margin-bottom: ${theme.spacing.md}px;
`;

const OrderItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const ItemImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.sm}px;
  margin-right: ${theme.spacing.sm}px;
`;

const ItemDetails = styled.View`
  flex: 1;
`;

const ItemName = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
  margin-bottom: 2px;
`;

const ItemInfo = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.textSecondary};
`;

const ItemQuantity = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-left: ${theme.spacing.sm}px;
`;

const OrderFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.md}px;
`;

const DeliveryInfo = styled.View`
  flex: 1;
`;

const DeliveryAddress = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.textSecondary};
  margin-bottom: 2px;
`;

const PaymentMethod = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.textSecondary};
  text-transform: capitalize;
`;

const ActionButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  background-color: ${theme.colors.primary}20;
  border: 1px solid ${theme.colors.primary}40;
  border-radius: ${theme.borderRadius.md}px;
  margin-left: ${theme.spacing.sm}px;
`;

const ActionButtonText = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.primary};
`;

const EmptyOrdersContainer = styled(EmptyContainer)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xxl}px;
`;

const EmptyOrdersIcon = styled.Text`
  font-size: 80px;
  margin-bottom: ${theme.spacing.lg}px;
  opacity: 0.6;
`;

const EmptyOrdersTitle = styled(EmptyText)`
  font-size: ${theme.typography.fontSize.xl}px;
  margin-bottom: ${theme.spacing.md}px;
`;

const EmptyOrdersSubtitle = styled(BodyText)`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.md}px;
  line-height: ${theme.typography.lineHeight.relaxed * theme.typography.fontSize.md}px;
`;

const OrdersScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' }
  ];

  const getFilteredOrders = () => {
    switch (selectedFilter) {
      case 'active':
        return mockOrders.filter(order => 
          ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
        );
      case 'completed':
        return mockOrders.filter(order => 
          ['delivered', 'cancelled'].includes(order.status)
        );
      default:
        return mockOrders;
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'On the Way';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return '💳 Card';
      case 'cash': return '💵 Cash';
      case 'online': return '🌐 Online';
      default: return method;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleOrderPress = (order: Order) => {
    // Handle order details navigation
    console.log('Order pressed:', order.id);
  };

  const handleReorder = (order: Order) => {
    // Handle reorder functionality
    console.log('Reorder:', order.id);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderCard onPress={() => handleOrderPress(item)}>
      <OrderHeader>
        <OrderInfo>
          <OrderId>{item.id}</OrderId>
          <OrderDate>{formatDate(item.orderDate)}</OrderDate>
          <OrderAmount>${item.totalAmount.toFixed(2)}</OrderAmount>
        </OrderInfo>
        <StatusBadge status={item.status}>
          <StatusText status={item.status}>
            {getStatusLabel(item.status)}
          </StatusText>
        </StatusBadge>
      </OrderHeader>

      <OrderItems>
        {item.items.map((cartItem, index) => (
          <OrderItem key={index}>
            <ItemImage 
              source={{ uri: cartItem.pizza.image }} 
              resizeMode="cover"
            />
            <ItemDetails>
              <ItemName>{cartItem.pizza.name}</ItemName>
              <ItemInfo>
                {cartItem.size} • ${(cartItem.pizza.price * (cartItem.size === 'small' ? 0.8 : cartItem.size === 'large' ? 1.3 : 1)).toFixed(2)} each
              </ItemInfo>
            </ItemDetails>
            <ItemQuantity>×{cartItem.quantity}</ItemQuantity>
          </OrderItem>
        ))}
      </OrderItems>

      <OrderFooter>
        <DeliveryInfo>
          <DeliveryAddress>📍 {item.deliveryAddress}</DeliveryAddress>
          <PaymentMethod>{getPaymentMethodLabel(item.paymentMethod)}</PaymentMethod>
        </DeliveryInfo>
        {item.status === 'delivered' && (
          <ActionButton onPress={() => handleReorder(item)}>
            <ActionButtonText>Reorder</ActionButtonText>
          </ActionButton>
        )}
      </OrderFooter>
    </OrderCard>
  );

  const renderEmptyState = () => (
    <EmptyOrdersContainer>
      <EmptyOrdersIcon>📋</EmptyOrdersIcon>
      <EmptyOrdersTitle>No Orders Yet</EmptyOrdersTitle>
      <EmptyOrdersSubtitle>
        Your order history will appear here once you place your first order
      </EmptyOrdersSubtitle>
    </EmptyOrdersContainer>
  );

  const filteredOrders = getFilteredOrders();

  return (
    <SafeContainer>
      <OrdersContainer>
        <HeaderContainer>
          <OrdersTitle>My Orders</OrdersTitle>
          
          <FilterContainer>
            {filters.map((filter) => (
              <FilterButton
                key={filter.id}
                active={selectedFilter === filter.id}
                onPress={() => setSelectedFilter(filter.id as any)}
              >
                <FilterButtonText active={selectedFilter === filter.id}>
                  {filter.label}
                </FilterButtonText>
              </FilterButton>
            ))}
          </FilterContainer>
        </HeaderContainer>
        
        <PaddingContainer>

          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingTop: theme.spacing.sm,
              paddingBottom: 100,
              flexGrow: 1
            }}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          />
        </PaddingContainer>
      </OrdersContainer>
    </SafeContainer>
  );
};

export default OrdersScreen; 