import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../styles/theme';
import { CartItem, Order } from '../types';
import { restaurantInfo } from '../data/restaurant';
import { 
  SafeContainer, 
  PaddingContainer, 
  Title, 
  Subtitle, 
  BodyText, 
  PriceText, 
  PrimaryButton, 
  ButtonText,
  Input,
  InputLabel,
  Card,
  Row,
  Divider
} from '../styles/styled';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  onPlaceOrder: (order: Omit<Order, 'id' | 'orderDate' | 'estimatedDeliveryTime' | 'status'>) => void;
  onGoBack: () => void;
}

const CheckoutContainer = styled.View`
  flex: 1;
`;

const Section = styled.View`
  margin-bottom: ${theme.spacing.xl}px;
`;

const SectionTitle = styled(Subtitle)`
  margin-bottom: ${theme.spacing.md}px;
`;

const FormRow = styled.View`
  margin-bottom: ${theme.spacing.md}px;
`;

const PaymentMethodCard = styled.TouchableOpacity<{ selected: boolean }>`
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.md}px;
  border: 2px solid ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.border};
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.backgroundSecondary : theme.colors.background};
  margin-bottom: ${theme.spacing.sm}px;
`;

const PaymentMethodText = styled(BodyText)<{ selected: boolean }>`
  font-weight: ${(props: { selected: boolean }) => props.selected ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular};
  color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.textPrimary};
`;

const OrderSummaryCard = styled(Card)`
  background-color: ${theme.colors.backgroundSecondary};
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const TotalRow = styled(SummaryRow)`
  margin-top: ${theme.spacing.md}px;
  padding-top: ${theme.spacing.md}px;
  border-top: 1px solid ${theme.colors.border};
`;

const PlaceOrderButton = styled(PrimaryButton)`
  margin-top: ${theme.spacing.lg}px;
  width: 100%;
`;

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ 
  cartItems, 
  onPlaceOrder, 
  onGoBack 
}) => {
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    specialInstructions: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.pizza.price * item.quantity), 0);
  const deliveryFee = restaurantInfo.deliveryFee;
  const total = subtotal + deliveryFee;

  const paymentMethods = [
    { id: 'cash', label: 'Cash on Delivery', icon: '💵' },
    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'online', label: 'Online Payment', icon: '🌐' },
  ];

  const handlePlaceOrder = () => {
    // Validate required fields
    if (!deliveryInfo.name.trim() || !deliveryInfo.phone.trim() || !deliveryInfo.address.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (!deliveryInfo.phone.match(/^\+?[\d\s\-\(\)]+$/)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
      return;
    }

    const orderData = {
      items: cartItems,
      totalAmount: total,
      deliveryAddress: `${deliveryInfo.address}, ${deliveryInfo.city} ${deliveryInfo.zipCode}`,
      customerName: deliveryInfo.name,
      customerPhone: deliveryInfo.phone,
      paymentMethod,
      specialInstructions: deliveryInfo.specialInstructions || undefined,
    };

    Alert.alert(
      'Confirm Order',
      `Total: $${total.toFixed(2)}\n\nAre you sure you want to place this order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Place Order', onPress: () => onPlaceOrder(orderData) }
      ]
    );
  };

  return (
    <SafeContainer>
      <CheckoutContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <PaddingContainer>
            <Title>Checkout</Title>
            
            {/* Delivery Information */}
            <Section>
              <SectionTitle>Delivery Information</SectionTitle>
              
              <FormRow>
                <InputLabel>Full Name *</InputLabel>
                <Input
                  value={deliveryInfo.name}
                  onChangeText={(text: string) => setDeliveryInfo(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your full name"
                />
              </FormRow>
              
              <FormRow>
                <InputLabel>Phone Number *</InputLabel>
                <Input
                  value={deliveryInfo.phone}
                  onChangeText={(text: string) => setDeliveryInfo(prev => ({ ...prev, phone: text }))}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </FormRow>
              
              <FormRow>
                <InputLabel>Street Address *</InputLabel>
                <Input
                  value={deliveryInfo.address}
                  onChangeText={(text: string) => setDeliveryInfo(prev => ({ ...prev, address: text }))}
                  placeholder="Enter your street address"
                  multiline
                />
              </FormRow>
              
              <Row>
                <FormRow style={{ flex: 1, marginRight: theme.spacing.sm }}>
                  <InputLabel>City</InputLabel>
                  <Input
                    value={deliveryInfo.city}
                    onChangeText={(text: string) => setDeliveryInfo(prev => ({ ...prev, city: text }))}
                    placeholder="City"
                  />
                </FormRow>
                
                <FormRow style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                  <InputLabel>ZIP Code</InputLabel>
                  <Input
                    value={deliveryInfo.zipCode}
                    onChangeText={(text: string) => setDeliveryInfo(prev => ({ ...prev, zipCode: text }))}
                    placeholder="ZIP Code"
                    keyboardType="numeric"
                  />
                </FormRow>
              </Row>
              
              <FormRow>
                <InputLabel>Special Instructions</InputLabel>
                <Input
                  value={deliveryInfo.specialInstructions}
                  onChangeText={(text: string) => setDeliveryInfo(prev => ({ ...prev, specialInstructions: text }))}
                  placeholder="Any special delivery instructions?"
                  multiline
                  numberOfLines={3}
                />
              </FormRow>
            </Section>

            {/* Payment Method */}
            <Section>
              <SectionTitle>Payment Method</SectionTitle>
              
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  selected={paymentMethod === method.id}
                  onPress={() => setPaymentMethod(method.id as 'cash' | 'card' | 'online')}
                >
                  <PaymentMethodText selected={paymentMethod === method.id}>
                    {method.icon} {method.label}
                  </PaymentMethodText>
                </PaymentMethodCard>
              ))}
            </Section>

            {/* Order Summary */}
            <Section>
              <SectionTitle>Order Summary</SectionTitle>
              
              <OrderSummaryCard>
                {cartItems.map((item) => (
                  <SummaryRow key={item.pizza.id}>
                    <BodyText>{item.pizza.name} x{item.quantity}</BodyText>
                    <PriceText>${(item.pizza.price * item.quantity).toFixed(2)}</PriceText>
                  </SummaryRow>
                ))}
                
                <Divider />
                
                <SummaryRow>
                  <BodyText>Subtotal</BodyText>
                  <PriceText>${subtotal.toFixed(2)}</PriceText>
                </SummaryRow>
                
                <SummaryRow>
                  <BodyText>Delivery Fee</BodyText>
                  <PriceText>${deliveryFee.toFixed(2)}</PriceText>
                </SummaryRow>
                
                <TotalRow>
                  <Title>Total</Title>
                  <PriceText style={{ fontSize: theme.typography.fontSize.xl }}>
                    ${total.toFixed(2)}
                  </PriceText>
                </TotalRow>
              </OrderSummaryCard>
            </Section>

            <PlaceOrderButton onPress={handlePlaceOrder}>
              <ButtonText>Place Order • ${total.toFixed(2)}</ButtonText>
            </PlaceOrderButton>
          </PaddingContainer>
        </ScrollView>
      </CheckoutContainer>
    </SafeContainer>
  );
};

export default CheckoutScreen; 