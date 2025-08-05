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
  background-color: #FFFFFF;
  border-radius: 16px;
  margin: 8px;
  border: 1px solid #E2E8F0;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;



const ContentWrapper = styled.View`
  padding: 16px;
`;

const TopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ImageSection = styled.View`
  align-items: center;
  margin-left: 16px;
`;

const ImageContainer = styled.View`
  width: 100px;
  height: 100px;
  background-color: #F1F5F9;
  border-radius: 12px;
  margin-bottom: 8px;
  overflow: hidden;
`;

const PizzaImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const CategoryBadge = styled.View<{ category: string }>`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${(props: { category: string }) => {
    switch (props.category) {
      case 'classic': return theme.colors.primary;
      case 'premium': return theme.colors.secondary;
      case 'vegetarian': return theme.colors.accent;
      case 'spicy': return theme.colors.error;
      default: return theme.colors.primary;
    }
  }};
  padding: 3px 6px;
  border-radius: ${theme.borderRadius.xs}px;
  border: 1px solid ${theme.colors.backgroundCard};
`;

const CategoryText = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textInverse};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const TopContent = styled.View`
  flex: 1;
`;

const PizzaName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 6px;
`;

const PizzaDescription = styled.Text`
  font-size: 14px;
  color: #6B7280;
  line-height: 20px;
  margin-bottom: 12px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PriceContainer = styled.View`
  align-items: flex-start;
`;

const Price = styled.Text`
  font-size: ${theme.typography.fontSize.xl}px;
  font-weight: ${theme.typography.fontWeight.extrabold};
  color: ${theme.colors.primary};
  margin-bottom: 2px;
`;

const PreparationTime = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.textTertiary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.round}px;
  width: 100px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.primaryLight};
`;

const AddButtonText = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textInverse};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAddToCart, onPress, index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animation based on index
    const delay = index * 100; // Faster animation
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
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
      <CardContainer onPress={() => onPress(pizza)} activeOpacity={0.9}>
        <ContentWrapper>
          <TopRow>
            <TopContent>
              <PizzaName>{pizza.name}</PizzaName>
              <PizzaDescription>{pizza.description}</PizzaDescription>
              <PriceContainer>
                <Price>${pizza.price.toFixed(2)}</Price>
                <PreparationTime>⏱️ {pizza.preparationTime} min</PreparationTime>
              </PriceContainer>
            </TopContent>
            
            <ImageSection>
              <ImageContainer>
                <PizzaImage 
                  source={pizza.image} 
                  resizeMode="cover"
                />
                <CategoryBadge category={pizza.category}>
                  <CategoryText>{getCategoryLabel(pizza.category)}</CategoryText>
                </CategoryBadge>
              </ImageContainer>
              
              <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                <AddButton onPress={handleViewDetails} activeOpacity={0.8}>
                  <AddButtonText>Order</AddButtonText>
                </AddButton>
              </Animated.View>
            </ImageSection>
          </TopRow>
        </ContentWrapper>
      </CardContainer>
    </Animated.View>
  );
};

export default PizzaCard; 