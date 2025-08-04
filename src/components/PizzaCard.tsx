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
  background-color: #ffffff;
  border-radius: 16px;
  margin-top: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  margin-horizontal: ${theme.spacing.md}px;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 20px;
  elevation: 12;
  overflow: hidden;
  border: 1px solid #f0f0f0;
`;

const ImageContainer = styled.View`
  position: relative;
  height: 220px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
      case 'classic': return '#3b82f6';
      case 'premium': return '#f59e0b';
      case 'vegetarian': return '#10b981';
      case 'spicy': return '#ef4444';
      default: return '#3b82f6';
    }
  }};
  padding: 8px 16px;
  border-radius: 20px;
  shadow-color: rgba(0, 0, 0, 0.15);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

const CategoryText = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContentContainer = styled.View`
  padding: 24px;
  background-color: #ffffff;
`;

const PizzaName = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 28px;
`;

const PizzaDescription = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  line-height: 22px;
  margin-bottom: 20px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top-width: 1px;
  border-top-color: #f3f4f6;
`;

const PriceContainer = styled.View`
  align-items: flex-start;
`;

const Price = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
`;

const PreparationTime = styled.Text`
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
`;

const AddButton = styled.TouchableOpacity`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  padding: 12px 24px;
  border-radius: 25px;
  min-width: 100px;
  align-items: center;
  justify-content: center;
  shadow-color: rgba(59, 130, 246, 0.3);
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 4;
`;

const AddButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
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