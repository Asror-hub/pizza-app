import React, { useState } from 'react';
import { TouchableOpacity, Vibration, Text } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../styles/theme';
import { CartItem as CartItemType } from '../types';
import { Card, Title, BodyText, Row, CaptionText } from '../styles/styled';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (pizzaId: string, size: 'small' | 'medium' | 'large', quantity: number) => void;
  onRemove: (pizzaId: string) => void;
}

const CartItemContainer = styled(Card)`
  flex-direction: row;
  align-items: flex-start;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.lg}px;
  border: 1px solid ${theme.colors.borderLight};
  background-color: ${theme.colors.background};
  shadow-color: rgba(0, 0, 0, 0.08);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 2;
`;

const ImageContainer = styled.View`
  position: relative;
  margin-right: ${theme.spacing.md}px;
`;

const PizzaImage = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: ${theme.borderRadius.md}px;
`;

const ImageOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${theme.borderRadius.md}px;
`;

const ItemInfo = styled.View`
  flex: 1;
  justify-content: space-between;
  min-height: 70px;
`;

const ItemHeader = styled.View`
  margin-bottom: ${theme.spacing.sm}px;
`;

const ItemTitle = styled(Title)`
  font-size: ${theme.typography.fontSize.lg}px;
  margin-bottom: 2px;
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: ${theme.typography.lineHeight.tight * theme.typography.fontSize.lg}px;
`;

const ItemDetails = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const SizeBadge = styled.View`
  background-color: ${theme.colors.primary}20;
  border: 1px solid ${theme.colors.primary}40;
  padding: 2px ${theme.spacing.xs}px;
  border-radius: ${theme.borderRadius.sm}px;
  margin-right: ${theme.spacing.xs}px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  elevation: 1;
`;

const SizeText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 9px;
  font-weight: ${theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const PriceText = styled.Text`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const ItemNote = styled.View`
  background-color: ${theme.colors.primary}15;
  border: 1px solid ${theme.colors.primary}30;
  border-radius: ${theme.borderRadius.sm}px;
  padding: 4px;
  margin-bottom: ${theme.spacing.sm}px;
`;

const NoteText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 9px;
  font-weight: ${theme.typography.fontWeight.medium};
  font-style: italic;
`;

const ItemFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const QuantityControls = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.backgroundSecondary};
  border-radius: ${theme.borderRadius.md}px;
  padding: 2px;
  border: 1px solid ${theme.colors.border};
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
  elevation: 1;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 28px;
  height: 28px;
  border-radius: ${theme.borderRadius.round}px;
  background-color: ${theme.colors.background};
  justify-content: center;
  align-items: center;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  elevation: 1;
`;

const QuantityText = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin: 0 ${theme.spacing.sm}px;
  min-width: 20px;
  text-align: center;
`;

const PriceSection = styled.View`
  align-items: flex-end;
`;

const UnitPrice = styled.Text`
  color: ${theme.colors.textSecondary};
  font-size: 9px;
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: 2px;
`;

const TotalPrice = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

const RemoveButton = styled.TouchableOpacity`
  padding: 2px ${theme.spacing.xs}px;
  background-color: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.sm}px;
  shadow-color: ${theme.colors.error};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  elevation: 1;
`;

const RemoveText = styled.Text`
  font-size: 9px;
  color: ${theme.colors.error};
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: center;
`;

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const getSizePrice = (size: 'small' | 'medium' | 'large') => {
    const basePrice = item.pizza.price;
    switch (size) {
      case 'small': return basePrice * 0.8;
      case 'medium': return basePrice;
      case 'large': return basePrice * 1.3;
    }
  };

  const handleIncrement = () => {
    Vibration.vibrate(10);
    onUpdateQuantity(item.pizza.id, item.size, item.quantity + 1);
  };

  const handleDecrement = () => {
    Vibration.vibrate(10);
    if (item.quantity > 1) {
      onUpdateQuantity(item.pizza.id, item.size, item.quantity - 1);
    } else {
      handleRemove();
    }
  };

  const handleRemove = () => {
    Vibration.vibrate(50);
    onRemove(item.pizza.id);
  };

  const sizePrice = getSizePrice(item.size);
  const totalPrice = sizePrice * item.quantity;

  return (
    <CartItemContainer>
      <ImageContainer>
        <PizzaImage 
          source={{ uri: item.pizza.image }} 
          resizeMode="cover"
        />
        <ImageOverlay />
      </ImageContainer>
      
      <ItemInfo>
        <ItemHeader>
          <ItemTitle>{item.pizza.name}</ItemTitle>
          <ItemDetails>
            <SizeBadge>
              <SizeText>{item.size}</SizeText>
            </SizeBadge>
            <PriceText>${sizePrice.toFixed(2)} each</PriceText>
          </ItemDetails>
          {item.specialInstructions && (
            <ItemNote>
              <NoteText>📝 {item.specialInstructions}</NoteText>
            </ItemNote>
          )}
        </ItemHeader>
        
        <ItemFooter>
          <QuantityControls>
            <QuantityButton 
              onPress={handleDecrement}
            >
              <Text style={{ 
                color: theme.colors.textPrimary, 
                fontWeight: 'bold',
                fontSize: theme.typography.fontSize.md
              }}>
                −
              </Text>
            </QuantityButton>
            <QuantityText>{item.quantity}</QuantityText>
            <QuantityButton 
              onPress={handleIncrement}
            >
              <Text style={{ 
                color: theme.colors.textPrimary, 
                fontWeight: 'bold',
                fontSize: theme.typography.fontSize.md
              }}>
                +
              </Text>
            </QuantityButton>
          </QuantityControls>
          
          <PriceSection>
            <UnitPrice>${sizePrice.toFixed(2)} each</UnitPrice>
            <TotalPrice>${totalPrice.toFixed(2)}</TotalPrice>
            <RemoveButton onPress={handleRemove}>
              <RemoveText>Remove</RemoveText>
            </RemoveButton>
          </PriceSection>
        </ItemFooter>
      </ItemInfo>
    </CartItemContainer>
  );
};

export default CartItem; 