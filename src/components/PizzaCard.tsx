import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../styles/theme';
import { Pizza } from '../types';

interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart: (pizza: Pizza, quantity?: number, size?: 'small' | 'medium' | 'large') => void;
  onPress: (pizza: Pizza) => void;
  index?: number;
}

const CardContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.background};
  border-top-left-radius: ${theme.borderRadius.lg}px;
  border-top-right-radius: ${theme.borderRadius.lg}px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-top: ${theme.spacing.sm}px;
  margin-bottom: ${theme.spacing.md}px;
  shadow-color: #000000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.4;
  shadow-radius: 16px;
  elevation: 12;
  overflow: hidden;
`;

const ImageContainer = styled.View`
  position: relative;
  height: 180px;
  background-color: ${theme.colors.backgroundSecondary};
`;

const PizzaImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const CategoryBadge = styled.View<{ category: string }>`
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: ${(props: { category: string }) => {
    switch (props.category) {
      case 'classic': return theme.colors.primary;
      case 'premium': return theme.colors.accent;
      case 'vegetarian': return theme.colors.success;
      case 'spicy': return theme.colors.error;
      default: return theme.colors.primary;
    }
  }};
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.round}px;
  shadow-color: rgba(0, 0, 0, 0.2);
  shadow-offset: 0px 1px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 2;
`;

const CategoryText = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textInverse};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ContentContainer = styled.View`
  padding: ${theme.spacing.md}px;
`;

const PizzaName = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs}px;
  line-height: ${theme.typography.lineHeight.tight * theme.typography.fontSize.lg}px;
`;

const PizzaDescription = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.regular};
  color: ${theme.colors.textSecondary};
  line-height: ${theme.typography.lineHeight.normal * theme.typography.fontSize.sm}px;
  margin-bottom: ${theme.spacing.md}px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.borderLight};
`;

const PriceContainer = styled.View`
  align-items: flex-start;
`;

const Price = styled.Text`
  font-size: ${theme.typography.fontSize.xl}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs}px;
`;

const PreparationTime = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.sm}px ${theme.spacing.lg}px;
  border-radius: ${theme.borderRadius.round}px;
  min-width: 100px;
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 2;
`;

const AddButtonText = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textInverse};
`;

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAddToCart, onPress, index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animation based on index
    const delay = index * 150; // 150ms delay between each card
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'classic': return 'Classic';
      case 'premium': return 'Premium';
      case 'vegetarian': return 'Veg';
      case 'spicy': return 'Spicy';
      default: return category;
    }
  };

  const handleViewDetails = (e: any) => {
    e.stopPropagation();
    
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to pizza details screen
    onPress(pizza);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <CardContainer onPress={() => onPress(pizza)}>
        <ImageContainer>
          <PizzaImage 
            source={{ uri: pizza.image }} 
            resizeMode="cover"
          />
          <CategoryBadge category={pizza.category}>
            <CategoryText>{getCategoryLabel(pizza.category)}</CategoryText>
          </CategoryBadge>
        </ImageContainer>
        
        <ContentContainer>
          <PizzaName>{pizza.name}</PizzaName>
          <PizzaDescription>{pizza.description}</PizzaDescription>
          
          <BottomRow>
            <PriceContainer>
              <Price>${pizza.price.toFixed(2)}</Price>
              <PreparationTime>⏱️ {pizza.preparationTime} min</PreparationTime>
            </PriceContainer>
            
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <AddButton onPress={handleViewDetails} activeOpacity={0.8}>
                <AddButtonText>Order</AddButtonText>
              </AddButton>
            </Animated.View>
          </BottomRow>
        </ContentContainer>
      </CardContainer>
    </Animated.View>
  );
};

export default PizzaCard; 