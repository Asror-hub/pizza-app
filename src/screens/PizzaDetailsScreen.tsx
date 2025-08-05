import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, Image, TouchableOpacity, Dimensions, ScrollView, PanResponder, Animated, NativeSyntheticEvent, NativeScrollEvent, Text } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../styles/theme';
import { Pizza } from '../types';
import { 
  Title, 
  Subtitle, 
  BodyText, 
  CaptionText,
  Row,
  PrimaryButton,
  ButtonText
} from '../styles/styled';

interface PizzaDetailsScreenProps {
  pizza: Pizza;
  onAddToCart: (pizza: Pizza, quantity: number, size: 'small' | 'medium' | 'large') => void;
  onGoBack: () => void;
  visible: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

const ModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled(Animated.View)`
  background-color: ${theme.colors.background};
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  max-height: ${screenHeight * 0.95}px;
  min-height: ${screenHeight * 0.8}px;
  shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 0px -8px;
  shadow-opacity: 0.4;
  shadow-radius: 24px;
  elevation: 20;
`;

const DragHandle = styled.View`
  width: 48px;
  height: 6px;
  background-color: ${theme.colors.borderDark};
  border-radius: 3px;
  align-self: center;
  margin-top: 16px;
  margin-bottom: 12px;
`;

const PullDownText = styled.Text`
  text-align: center;
  color: ${theme.colors.textTertiary};
  font-size: ${theme.typography.fontSize.xs}px;
  margin-bottom: ${theme.spacing.md}px;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const HeaderContainer = styled.View`
  position: relative;
  height: 240px;
  background-color: ${theme.colors.backgroundSecondary};
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  overflow: hidden;
`;

const PizzaImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const ImageOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
`;

const CategoryBadge = styled.View<{ category: string }>`
  position: absolute;
  top: 24px;
  right: 24px;
  background-color: ${(props: { category: string }) => {
    switch (props.category) {
      case 'classic': return theme.colors.primary;
      case 'premium': return theme.colors.accent;
      case 'vegetarian': return theme.colors.secondary;
      case 'spicy': return theme.colors.error;
      default: return theme.colors.primary;
    }
  }};
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.xl}px;
  shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 0px 4px;
  shadow-opacity: 0.4;
  shadow-radius: 8px;
  elevation: 6;
`;

const CategoryText = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textInverse};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 24px;
  left: 24px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: ${theme.borderRadius.round}px;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.2);
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const ContentContainer = styled.ScrollView`
  padding: ${theme.spacing.xl}px ${theme.spacing.xxxl}px ${theme.spacing.xxxl}px;
  padding-bottom: 140px;
  background-color: ${theme.colors.background};
`;

const PizzaName = styled(Title)`
  margin-bottom: ${theme.spacing.md}px;
  font-size: ${theme.typography.fontSize.xxl}px;
  line-height: ${theme.typography.lineHeight.tight * theme.typography.fontSize.xxl}px;
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.typography.fontWeight.extrabold};
  letter-spacing: -1px;
`;

const PizzaDescription = styled(BodyText)`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xxxl}px;
  line-height: ${theme.typography.lineHeight.relaxed * theme.typography.fontSize.lg}px;
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.regular};
`;

const SectionTitle = styled(Subtitle)`
  margin-bottom: ${theme.spacing.xl}px;
  font-size: ${theme.typography.fontSize.xl}px;
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.typography.fontWeight.regular};
  letter-spacing: -0.5px;
`;

const IngredientsContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const IngredientItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  margin-bottom: ${theme.spacing.sm}px;
  width: 48%;
  background-color: ${theme.colors.backgroundSecondary};
  border-radius: ${theme.borderRadius.md}px;
  border: 1px solid ${theme.colors.borderLight};
`;

const IngredientDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: ${theme.borderRadius.round}px;
  background-color: ${theme.colors.primary};
  margin-right: ${theme.spacing.sm}px;
`;

const IngredientText = styled(BodyText)`
  flex: 1;
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
`;

const ToppingsContainer = styled.View`
  margin-bottom: ${theme.spacing.xxxl}px;
`;

const ToppingItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  margin-bottom: ${theme.spacing.xs}px;
  background-color: ${theme.colors.backgroundSecondary};
  border-radius: ${theme.borderRadius.sm}px;
  border: 1px solid ${theme.colors.borderLight};
`;

const ToppingText = styled(BodyText)`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.medium};
  flex: 1;
  color: ${theme.colors.textPrimary};
`;

const ToppingPrice = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-right: ${theme.spacing.xs}px;
`;

const ToppingCheckbox = styled.View<{ selected: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: ${theme.borderRadius.round}px;
  border: 2px solid ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.border};
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : 'transparent'};
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.xs}px;
  shadow-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : 'transparent'};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: { selected: boolean }) => props.selected ? 0.3 : 0};
  shadow-radius: 4px;
  elevation: ${(props: { selected: boolean }) => props.selected ? 3 : 0};
`;

const SizeContainer = styled.View`
  margin-bottom: ${theme.spacing.xxxl}px;
`;

const SizeOptions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: ${theme.spacing.md}px;
`;

const SizeButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm}px ${theme.spacing.xs}px;
  border-radius: ${theme.borderRadius.md}px;
  border: 2px solid ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.border};
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.backgroundSecondary};
  align-items: center;
  justify-content: center;
  min-height: 45px;
  shadow-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props: { selected: boolean }) => props.selected ? 0.4 : 0.1};
  shadow-radius: 8px;
  elevation: ${(props: { selected: boolean }) => props.selected ? 6 : 2};
`;

const SizeButtonText = styled.Text<{ selected: boolean }>`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${(props: { selected: boolean }) => props.selected ? theme.colors.textInverse : theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs}px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SizePrice = styled.Text<{ selected: boolean }>`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.extrabold};
  color: ${(props: { selected: boolean }) => props.selected ? theme.colors.textInverse : theme.colors.primary};
`;

const FixedBottomBar = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.lg}px ${theme.spacing.xxxl}px ${theme.spacing.xl}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.borderLight};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px -4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 12;
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.colors.backgroundSecondary};
  border-radius: ${theme.borderRadius.xl}px;
  padding: ${theme.spacing.xs}px;
  border: 1px solid ${theme.colors.borderLight};
`;

const QuantityButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.round}px;
  background-color: ${theme.colors.background};
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

const QuantityText = styled.Text`
  font-size: ${theme.typography.fontSize.xl}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  min-width: 60px;
  text-align: center;
`;

const AddToCartButton = styled(PrimaryButton)`
  flex: 1;
  margin-left: ${theme.spacing.lg}px;
  padding: ${theme.spacing.lg}px;
  border-radius: ${theme.borderRadius.xl}px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.4;
  shadow-radius: 12px;
  elevation: 8;
  opacity: ${(props: { disabled: boolean }) => props.disabled ? 0.7 : 1};
`;

const SuccessMessage = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const SuccessContent = styled.View`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.xxxl}px;
  border-radius: ${theme.borderRadius.xl}px;
  border: 3px solid ${theme.colors.primary};
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.4);
  shadow-offset: 0px 12px;
  shadow-opacity: 0.6;
  shadow-radius: 24px;
  elevation: 16;
  min-width: 280px;
`;

const SuccessIcon = styled.Text`
  font-size: 48px;
  margin-bottom: ${theme.spacing.md}px;
`;

const SuccessText = styled.Text`
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.xl}px;
  font-weight: ${theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const SuccessSubtext = styled.Text`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.md}px;
  text-align: center;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.lg}px;
  background-color: ${theme.colors.backgroundSecondary};
  border-radius: ${theme.borderRadius.md}px;
  border: 1px solid ${theme.colors.borderLight};
`;

const InfoLabel = styled(CaptionText)`
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const InfoValue = styled(BodyText)`
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.md}px;
`;

const PizzaDetailsScreen: React.FC<PizzaDetailsScreenProps> = ({ 
  pizza, 
  onAddToCart, 
  onGoBack,
  visible
}) => {
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Animation values
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.9)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  // Mock toppings data
  const availableToppings = [
    { name: 'Extra Cheese', price: 2.50 },
    { name: 'Pepperoni', price: 3.00 },
    { name: 'Mushrooms', price: 2.00 },
    { name: 'Bell Peppers', price: 1.50 },
    { name: 'Olives', price: 2.00 },
    { name: 'Bacon', price: 3.50 },
    { name: 'Sausage', price: 3.00 },
    { name: 'Pineapple', price: 2.00 },
  ];

  // Entrance animations
  useEffect(() => {
    if (visible) {
      // Reset values
      translateY.setValue(screenHeight);
      opacity.setValue(0);
      contentScale.setValue(0.9);
      contentOpacity.setValue(0);

      // Animate modal entrance - slide from bottom
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate content entrance with bounce effect
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(contentScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);
    }
  }, [visible]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'classic': return 'Classic';
      case 'premium': return 'Premium';
      case 'vegetarian': return 'Vegetarian';
      case 'spicy': return 'Spicy';
      default: return category;
    }
  };

  const getSizePrice = (size: 'small' | 'medium' | 'large') => {
    const basePrice = pizza.price;
    switch (size) {
      case 'small': return basePrice * 0.8;
      case 'medium': return basePrice;
      case 'large': return basePrice * 1.3;
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add to cart
    onAddToCart(pizza, quantity, selectedSize);
    
    // Show success message
    setShowSuccess(true);
    setIsAddingToCart(false);
    
    // Wait a bit then close modal with smooth exit animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onGoBack();
        setShowSuccess(false);
      });
    }, 800);
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(name => name !== toppingName)
        : [...prev, toppingName]
    );
  };

  const getToppingsTotal = () => {
    return selectedToppings.reduce((total, toppingName) => {
      const topping = availableToppings.find(t => t.name === toppingName);
      return total + (topping?.price || 0);
    }, 0);
  };

  const getTotalPrice = () => {
    const sizePrice = getSizePrice(selectedSize);
    const toppingsTotal = getToppingsTotal();
    return (sizePrice + toppingsTotal) * quantity;
  };

  const headerPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
    onPanResponderGrant: () => {
      translateY.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50 || gestureState.vy > 0.3) {
        // Close modal with smooth animation
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onGoBack();
        });
      } else {
        // Snap back with spring animation
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
  });

  const contentPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5 && isAtTop,
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5 && isAtTop,
    onPanResponderGrant: () => {
      translateY.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50 || gestureState.vy > 0.3) {
        // Close modal with smooth animation
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onGoBack();
        });
      } else {
        // Snap back with spring animation
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      presentationStyle="overFullScreen"
    >
      <Animated.View style={{ flex: 1, opacity }}>
        <ModalOverlay>
          <ModalContainer 
            style={{ 
              transform: [{ translateY }],
            }}
          >
            <View {...headerPanResponder.panHandlers}>
              <DragHandle />
              <PullDownText>Pull down to close</PullDownText>
            </View>
            
            <HeaderContainer {...headerPanResponder.panHandlers}>
              <CloseButton onPress={onGoBack}>
                <Text style={{ fontSize: 24, color: theme.colors.textPrimary, fontWeight: 'bold' }}>✕</Text>
              </CloseButton>
              
              <PizzaImage source={pizza.image} />
              
              <CategoryBadge category={pizza.category}>
                <CategoryText>{getCategoryLabel(pizza.category)}</CategoryText>
              </CategoryBadge>
            </HeaderContainer>

            <View {...contentPanResponder.panHandlers}>
              <Animated.View style={{
                transform: [{ scale: contentScale }],
                opacity: contentOpacity,
              }}>
                <ContentContainer 
                  ref={scrollViewRef}
                  showsVerticalScrollIndicator={false}
                  onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                    const offsetY = event.nativeEvent.contentOffset.y;
                    setIsAtTop(offsetY <= 0);
                  }}
                  scrollEventThrottle={16}
                >
                  <PizzaName>{pizza.name}</PizzaName>
                  <PizzaDescription>{pizza.description}</PizzaDescription>

                  {/* Ingredients */}
                  <SectionTitle>Ingredients</SectionTitle>
                  <IngredientsContainer>
                    {pizza.ingredients.map((ingredient, index) => (
                      <IngredientItem key={index}>
                        <IngredientDot />
                        <IngredientText>{ingredient}</IngredientText>
                      </IngredientItem>
                    ))}
                  </IngredientsContainer>

                  {/* Size Selection */}
                  <SectionTitle>Choose Size</SectionTitle>
                  <SizeContainer>
                    <SizeOptions>
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <SizeButton
                          key={size}
                          selected={selectedSize === size}
                          onPress={() => setSelectedSize(size)}
                        >
                          <SizeButtonText selected={selectedSize === size}>
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </SizeButtonText>
                          <SizePrice selected={selectedSize === size}>
                            ${getSizePrice(size).toFixed(2)}
                          </SizePrice>
                        </SizeButton>
                      ))}
                    </SizeOptions>
                  </SizeContainer>

                  {/* Additional Toppings */}
                  <SectionTitle>Additional Toppings</SectionTitle>
                  <ToppingsContainer>
                    {availableToppings.map((topping, index) => (
                      <ToppingItem
                        key={index}
                        selected={selectedToppings.includes(topping.name)}
                        onPress={() => toggleTopping(topping.name)}
                      >
                        <ToppingCheckbox selected={selectedToppings.includes(topping.name)}>
                          {selectedToppings.includes(topping.name) && (
                            <Text style={{ color: 'white', fontSize: 12, lineHeight: 24, fontWeight: 'bold' }}>✓</Text>
                          )}
                        </ToppingCheckbox>
                        <ToppingText>{topping.name}</ToppingText>
                        <ToppingPrice>+${topping.price.toFixed(2)}</ToppingPrice>
                      </ToppingItem>
                    ))}
                  </ToppingsContainer>

                  {/* Spacer for bottom bar */}
                  <View style={{ height: 140 }} />

                </ContentContainer>
              </Animated.View>
            </View>
          </ModalContainer>

          {/* Fixed Bottom Bar */}
          <FixedBottomBar 
            style={{ 
              transform: [{ translateY }] 
            }}
          >
            <QuantityContainer>
              <QuantityButton onPress={decreaseQuantity}>
                <Text style={{ fontSize: 20, color: theme.colors.textPrimary, fontWeight: 'bold' }}>-</Text>
              </QuantityButton>
              <QuantityText>{quantity}</QuantityText>
              <QuantityButton onPress={increaseQuantity}>
                <Text style={{ fontSize: 20, color: theme.colors.textPrimary, fontWeight: 'bold' }}>+</Text>
              </QuantityButton>
            </QuantityContainer>

            <AddToCartButton 
              onPress={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ButtonText>
                {isAddingToCart ? 'Adding...' : `Add to Cart - $${((getSizePrice(selectedSize) + getToppingsTotal()) * quantity).toFixed(2)}`}
              </ButtonText>
            </AddToCartButton>
          </FixedBottomBar>
        </ModalOverlay>

        {/* Success Message Overlay */}
        {showSuccess && (
          <SuccessMessage>
            <SuccessContent>
              <SuccessIcon>🎉</SuccessIcon>
              <SuccessText>Added to Cart!</SuccessText>
              <SuccessSubtext>Your pizza is ready to order</SuccessSubtext>
            </SuccessContent>
          </SuccessMessage>
        )}
      </Animated.View>
    </Modal>
  );
};

export default PizzaDetailsScreen; 