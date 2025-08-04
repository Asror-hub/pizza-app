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
  border-radius: 16px;
  margin-top: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  margin-horizontal: ${theme.spacing.sm}px;
  shadow-color: ${theme.colors.shadow};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 20px;
  elevation: 12;
  overflow: hidden;
  border: 1px solid ${theme.colors.borderLight};
`;

const ImageContainer = styled.View`
  position: relative;
  height: 220px;
  background-color: ${theme.colors.backgroundSecondary};
  overflow: hidden;
`;

const PizzaImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const CategoryBadge = styled.View<{ category: string }>`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: ${(props: { category: string }) => {
    switch (props.category) {
      case 'classic': return theme.colors.primary;
      case 'premium': return theme.colors.accent;
      case 'vegetarian': return theme.colors.success;
      case 'spicy': return theme.colors.error;
      default: return theme.colors.primary;
    }
  }};
  padding: 8px 16px;
  border-radius: 20px;
  shadow-color: ${theme.colors.shadowDark};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

const CategoryText = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${theme.colors.textInverse};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContentContainer = styled.View`
  padding: 16px 20px;
  background-color: ${theme.colors.background};
`;

const PizzaName = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin-bottom: 6px;
  line-height: 24px;
`;

const PizzaDescription = styled.Text`
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  line-height: 18px;
  margin-bottom: 12px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.borderLight};
`;

const PriceContainer = styled.View`
  align-items: flex-start;
`;

const Price = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: 2px;
`;

const PreparationTime = styled.Text`
  font-size: 11px;
  color: ${theme.colors.textTertiary};
  font-weight: 500;
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 10px 20px;
  border-radius: 20px;
  min-width: 90px;
  align-items: center;
  justify-content: center;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 4;
`;

const AddButtonText = styled.Text`
  font-size: 13px;
  font-weight: 600;
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
            source={pizza.image} 
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