import React, { useState, useRef, useEffect } from 'react';
import { 
  FlatList, 
  Alert, 
  Animated, 
  TouchableOpacity,
  Dimensions,
  Vibration,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { theme } from '../styles/theme';
import { CartItem as CartItemType } from '../types';
import { restaurantInfo } from '../data/restaurant';
import { 
  SafeContainer, 
  ScrollContainer, 
  PaddingContainer, 
  Title, 
  BodyText, 
  PriceText, 
  PrimaryButton, 
  ButtonText,
  EmptyContainer,
  EmptyText,
  Divider
} from '../styles/styled';
import CartItem from '../components/CartItem';

const { width: screenWidth } = Dimensions.get('window');

interface CartScreenProps {
  cartItems: CartItemType[];
  onUpdateQuantity: (pizzaId: string, size: 'small' | 'medium' | 'large', quantity: number) => void;
  onRemoveItem: (pizzaId: string, size: 'small' | 'medium' | 'large') => void;
  onCheckout: () => void;
  onBackPress: () => void;
}

const CartContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const CartHeader = styled.View`
  padding-bottom: ${theme.spacing.xs}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.borderLight};
  background-color: ${theme.colors.background};
  margin-top: -10px
`;



const CartTitle = styled(Title)`
  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.primary};
  text-align: center;
`;

const CartSubtitle = styled(BodyText)`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: center;
`;

const CartItemsList = styled.View`
  flex: 1;
  margin-bottom: ${theme.spacing.sm}px;
  margin-top: 10px
`;



const EmptyCartContainer = styled(EmptyContainer)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.md}px;
`;

const EmptyCartIcon = styled.Text`
  font-size: 40px;
  margin-bottom: ${theme.spacing.sm}px;
  opacity: 0.8;
`;

const EmptyCartTitle = styled(EmptyText)`
  font-size: ${theme.typography.fontSize.md}px;
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: 4px;
  color: ${theme.colors.textPrimary};
`;

const EmptyCartSubtitle = styled(BodyText)`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xs}px;
  line-height: ${theme.typography.lineHeight.relaxed * theme.typography.fontSize.xs}px;
  margin-bottom: ${theme.spacing.md}px;
`;

const BrowseButtonContainer = styled.View`
  border-radius: ${theme.borderRadius.xl}px;
  overflow: hidden;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 4;
`;

const BrowseButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  background-color: transparent;
`;

const BrowseButtonText = styled(ButtonText)`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.bold};
`;

const MinimumOrderWarning = styled.View`
  background-color: ${theme.colors.error}10;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.md}px;
  margin-top: ${theme.spacing.md}px;
  align-items: center;
  flex-direction: row;
`;

const WarningIcon = styled.Text`
  font-size: 20px;
  margin-right: ${theme.spacing.sm}px;
`;

const WarningText = styled(BodyText)`
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: center;
  flex: 1;
`;

const DeliveryInfo = styled.View`
  background-color: ${theme.colors.primary}10;
  border: 1px solid ${theme.colors.primary}30;
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.md}px;
  margin-top: ${theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
`;

const DeliveryIcon = styled.Text`
  font-size: 20px;
  margin-right: ${theme.spacing.sm}px;
`;

const DeliveryText = styled(BodyText)`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  flex: 1;
`;

const SavingsInfo = styled.View`
  background-color: ${theme.colors.success}10;
  border: 1px solid ${theme.colors.success}30;
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.md}px;
  margin-top: ${theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
`;

const SavingsIcon = styled.Text`
  font-size: 20px;
  margin-right: ${theme.spacing.sm}px;
`;

const SavingsText = styled(BodyText)`
  color: ${theme.colors.success};
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  flex: 1;
`;



const DeliveryTimeInfo = styled.View`
  background-color: ${theme.colors.info}10;
  border: 1px solid ${theme.colors.info}30;
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.md}px;
  margin-top: ${theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
`;

const TimeIcon = styled.Text`
  font-size: 20px;
  margin-right: ${theme.spacing.sm}px;
`;

const TimeText = styled(BodyText)`
  color: ${theme.colors.info};
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  flex: 1;
`;

const CheckoutCard = styled.View`
  background-color: ${theme.colors.primary}05;
  border: 1px solid ${theme.colors.primary}20;
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  margin-top: ${theme.spacing.sm}px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 1;
`;

const CheckoutHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const CheckoutIcon = styled.Text`
  font-size: 14px;
  margin-right: 2px;
`;

const CheckoutTitle = styled(Title)`
  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.primary};
  margin-bottom: 0;
`;

const CheckoutSummary = styled.View`
  margin-bottom: ${theme.spacing.sm}px;
`;

const CheckoutRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

const CheckoutLabel = styled(BodyText)`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const CheckoutValue = styled(BodyText)`
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.textPrimary};
`;

const CheckoutTotal = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
  border-top: 1px solid ${theme.colors.primary}20;
  margin-bottom: ${theme.spacing.sm}px;
`;

const CheckoutTotalLabel = styled(PriceText)`
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.primary};
`;

const CheckoutTotalValue = styled(PriceText)`
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.primary};
`;

const CheckoutCardButton = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: ${(props: { disabled: boolean }) => 
    props.disabled 
      ? theme.colors.textTertiary 
      : theme.colors.primary
  };
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.md}px;
  align-items: center;
  justify-content: center;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 1px;
  shadow-opacity: ${(props: { disabled: boolean }) => props.disabled ? 0 : 0.3};
  shadow-radius: 2px;
  elevation: ${(props: { disabled: boolean }) => props.disabled ? 0 : 1};
`;

const CheckoutCardButtonText = styled(ButtonText)`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.bold};
`;

const CheckoutInfo = styled.View`
  padding: 4px;
  margin-top: 4px;
`;

const CheckoutInfoText = styled(BodyText)`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: ${theme.typography.lineHeight.normal * theme.typography.fontSize.xs}px;
`;

const CartScreen: React.FC<CartScreenProps> = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  onBackPress
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Animation values for scroll effects
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const checkoutCardOpacity = useRef(new Animated.Value(1)).current;
  const checkoutCardScale = useRef(new Animated.Value(1)).current;

  const getSizePrice = (size: 'small' | 'medium' | 'large', basePrice: number) => {
    switch (size) {
      case 'small': return basePrice * 0.8;
      case 'medium': return basePrice;
      case 'large': return basePrice * 1.3;
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const sizePrice = getSizePrice(item.size, item.pizza.price);
    return sum + (sizePrice * item.quantity);
  }, 0);
  
  const deliveryFee = subtotal > 0 ? restaurantInfo.deliveryFee : 0;
  const total = subtotal + deliveryFee;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate potential savings
  const potentialSavings = subtotal >= restaurantInfo.minimumOrder ? deliveryFee : 0;
  const isEligibleForFreeDelivery = subtotal >= restaurantInfo.minimumOrder;

  const animateCheckout = () => {
    setIsAnimating(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  const handleCheckout = () => {
    if (subtotal < restaurantInfo.minimumOrder) {
      Vibration.vibrate(100);
      Alert.alert(
        'Minimum Order Required',
        `Minimum order amount is $${restaurantInfo.minimumOrder.toFixed(2)}. Please add more items to your cart.`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    Vibration.vibrate(50);
    animateCheckout();
    onCheckout();
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    
    // Animate header and checkout card based on scroll
    if (offsetY > 100) {
      // Hide header and scale down checkout card when scrolling down
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(checkoutCardScale, {
          toValue: 0.98,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Show header and scale up checkout card when scrolling up
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(checkoutCardScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const renderCartItem = ({ item, index }: { item: CartItemType; index: number }) => {
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <CartItem
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={(pizzaId) => onRemoveItem(pizzaId, item.size)}
        />
      </Animated.View>
    );
  };

  const renderEmptyCart = () => (
    <EmptyCartContainer>
      <EmptyCartIcon>🍕</EmptyCartIcon>
      <EmptyCartTitle>Your cart is empty</EmptyCartTitle>
      <EmptyCartSubtitle>
        Add some delicious pizzas to get started!
      </EmptyCartSubtitle>
      <BrowseButtonContainer>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: theme.borderRadius.xl }}
        >
          <BrowseButton onPress={onBackPress}>
            <BrowseButtonText>Browse Menu</BrowseButtonText>
          </BrowseButton>
        </LinearGradient>
      </BrowseButtonContainer>
    </EmptyCartContainer>
  );

  return (
    <SafeContainer>
      <CartContainer>
        {/* Subtle back button */}
        <TouchableOpacity 
          onPress={onBackPress}
          style={{
            position: 'absolute',
            top: 30,
            left: 10,
            zIndex: 10,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
            elevation: 1,
          }}
        >
          <Text style={{ fontSize: 10, color: theme.colors.textPrimary }}>←</Text>
        </TouchableOpacity>

        <PaddingContainer style={{ flex: 1 }}>
          {/* Professional Cart Header */}
          <Animated.View
            style={{
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            }}
          >
            <CartHeader>
              <CartTitle>Your Cart</CartTitle>
              <CartSubtitle>
                {itemCount} item{itemCount !== 1 ? 's' : ''} • ${total.toFixed(2)}
              </CartSubtitle>
            </CartHeader>
          </Animated.View>

          {cartItems.length > 0 ? (
            <>
              <CartItemsList style={{ flex: 1 }}>
                <FlatList
                  data={cartItems}
                  renderItem={renderCartItem}
                  keyExtractor={(item) => `${item.pizza.id}-${item.size}`}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: theme.spacing.sm }}
                  removeClippedSubviews={true}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  style={{ flex: 1 }}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                />
              </CartItemsList>

              <Animated.View
                style={{
                  opacity: checkoutCardOpacity,
                  transform: [{ scale: checkoutCardScale }],
                }}
              >
                <CheckoutCard>
                  <CheckoutHeader>
                    <CheckoutIcon>🛒</CheckoutIcon>
                    <CheckoutTitle>Ready to Order</CheckoutTitle>
                  </CheckoutHeader>

                  <CheckoutSummary>
                    <CheckoutRow>
                      <CheckoutLabel>Subtotal ({itemCount} items)</CheckoutLabel>
                      <CheckoutValue>${subtotal.toFixed(2)}</CheckoutValue>
                    </CheckoutRow>
                    
                    <CheckoutRow>
                      <CheckoutLabel>Delivery Fee</CheckoutLabel>
                      <CheckoutValue>${deliveryFee.toFixed(2)}</CheckoutValue>
                    </CheckoutRow>
                    
                    {isEligibleForFreeDelivery && (
                      <CheckoutRow>
                        <CheckoutLabel>Delivery Savings</CheckoutLabel>
                        <CheckoutValue style={{ color: theme.colors.success }}>
                          -${potentialSavings.toFixed(2)}
                        </CheckoutValue>
                      </CheckoutRow>
                    )}
                    
                    <CheckoutTotal>
                      <CheckoutTotalLabel>Total</CheckoutTotalLabel>
                      <CheckoutTotalValue>${total.toFixed(2)}</CheckoutTotalValue>
                    </CheckoutTotal>
                  </CheckoutSummary>

                  {subtotal < restaurantInfo.minimumOrder ? (
                    <CheckoutInfo>
                      <CheckoutInfoText>
                        ⚠️ Add ${(restaurantInfo.minimumOrder - subtotal).toFixed(2)} more for free delivery
                      </CheckoutInfoText>
                    </CheckoutInfo>
                  ) : (
                    <CheckoutInfo>
                      <CheckoutInfoText>
                        🚚 Free delivery on orders over ${restaurantInfo.minimumOrder.toFixed(2)}
                      </CheckoutInfoText>
                    </CheckoutInfo>
                  )}

                  <Animated.View style={{ opacity: fadeAnim }}>
                    {subtotal < restaurantInfo.minimumOrder || isAnimating ? (
                      <CheckoutCardButton 
                        onPress={handleCheckout}
                        disabled={true}
                      >
                        <CheckoutCardButtonText>
                          Add ${(restaurantInfo.minimumOrder - subtotal).toFixed(2)} more to checkout
                        </CheckoutCardButtonText>
                      </CheckoutCardButton>
                    ) : (
                      <LinearGradient
                        colors={[theme.colors.primary, theme.colors.primaryDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderRadius: theme.borderRadius.md,
                          shadowColor: theme.colors.primary,
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.3,
                          shadowRadius: 2,
                          elevation: 1,
                        }}
                      >
                        <CheckoutCardButton 
                          onPress={handleCheckout}
                          disabled={false}
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <CheckoutCardButtonText>
                            Proceed to Checkout • ${total.toFixed(2)}
                          </CheckoutCardButtonText>
                        </CheckoutCardButton>
                      </LinearGradient>
                    )}
                  </Animated.View>
                </CheckoutCard>
              </Animated.View>
            </>
          ) : (
            renderEmptyCart()
          )}
        </PaddingContainer>
      </CartContainer>
    </SafeContainer>
  );
};

export default CartScreen; 