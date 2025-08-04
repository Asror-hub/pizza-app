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
`;

const ModalContainer = styled(Animated.View)`
  background-color: ${theme.colors.background};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  max-height: ${screenHeight * 0.95}px;
  min-height: ${screenHeight * 0.8}px;
`;

const DragHandle = styled.View`
  width: 40px;
  height: 4px;
  background-color: ${theme.colors.border};
  border-radius: 2px;
  align-self: center;
  margin-top: 12px;
  margin-bottom: 8px;
`;

const PullDownText = styled.Text`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xs}px;
  margin-bottom: ${theme.spacing.sm}px;
`;

const HeaderContainer = styled.View`
  position: relative;
  height: 200px;
  background-color: ${theme.colors.backgroundSecondary};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
`;

const PizzaImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const CategoryBadge = styled.View<{ category: string }>`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: ${(props: { category: string }) => {
    switch (props.category) {
      case 'classic': return theme.colors.primary;
      case 'premium': return theme.colors.accent;
      case 'vegetarian': return theme.colors.success;
      case 'spicy': return theme.colors.error;
      default: return theme.colors.primary;
    }
  }};
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.lg}px;
  shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.4;
  shadow-radius: 4px;
  elevation: 4;
`;

const CategoryText = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textInverse};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: ${theme.borderRadius.round}px;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.2);
  shadow-offset: 0px 3px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 5;
`;

const ContentContainer = styled.ScrollView`
  padding: ${theme.spacing.xl}px;
  padding-bottom: 120px;
  background-color: ${theme.colors.background};
`;

const PizzaName = styled(Title)`
  margin-bottom: ${theme.spacing.md}px;
  font-size: ${theme.typography.fontSize.xxl}px;
  line-height: ${theme.typography.lineHeight.tight * theme.typography.fontSize.xxl}px;
`;

const PizzaDescription = styled(BodyText)`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl}px;
  line-height: ${theme.typography.lineHeight.relaxed * theme.typography.fontSize.md}px;
  font-size: ${theme.typography.fontSize.md}px;
`;

const SectionTitle = styled(Subtitle)`
  margin-bottom: ${theme.spacing.lg}px;
  font-size: ${theme.typography.fontSize.xl}px;
  color: ${theme.colors.textPrimary};
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
  padding: ${theme.spacing.xs}px 0;
  margin-bottom: ${theme.spacing.xs}px;
  width: 48%;
`;

const IngredientDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: ${theme.borderRadius.round}px;
  background-color: ${theme.colors.primary};
  margin-right: ${theme.spacing.md}px;
`;

const IngredientText = styled(BodyText)`
  flex: 1;
  font-size: ${theme.typography.fontSize.sm}px;
`;

const ToppingsContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const ToppingItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm}px 0;
  margin-bottom: ${theme.spacing.xs}px;
`;

const ToppingText = styled(BodyText)`
  font-size: ${theme.typography.fontSize.sm}px;
  flex: 1;
`;

const ToppingPrice = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.primary};
  margin-right: ${theme.spacing.sm}px;
`;

const ToppingCheckbox = styled.View<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${theme.borderRadius.round}px;
  border: 2px solid ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.border};
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : 'transparent'};
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md}px;
`;

const SizeContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const SizeOptions = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const SizeButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  padding: ${theme.spacing.xs}px 4px;
  margin: 0 ${theme.spacing.xs}px;
  border-radius: ${theme.borderRadius.md}px;
  border: 2px solid ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.border};
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.backgroundSecondary};
  align-items: center;
  justify-content: center;
  min-height: 15px;
  shadow-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : 'transparent'};
  shadow-offset: 0px 3px;
  shadow-opacity: ${(props: { selected: boolean }) => props.selected ? 0.4 : 0};
  shadow-radius: 6px;
  elevation: ${(props: { selected: boolean }) => props.selected ? 4 : 0};
`;

const SizeButtonText = styled.Text<{ selected: boolean }>`
  font-size: 13px;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${(props: { selected: boolean }) => props.selected ? theme.colors.textInverse : theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs}px;
`;

const SizePrice = styled.Text<{ selected: boolean }>`
  font-size: 15px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${(props: { selected: boolean }) => props.selected ? theme.colors.textInverse : theme.colors.primary};
`;

const FixedBottomBar = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${theme.colors.background};
  padding: 10px 30px 20px 30px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px -2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 8;
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: ${theme.borderRadius.round}px;
  border: 2px solid ${theme.colors.primary};
  background-color: ${theme.colors.backgroundSecondary};
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 2;
`;

const QuantityText = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  min-width: 50px;
  text-align: center;
`;

const AddToCartButton = styled(PrimaryButton)`
  flex: 1;
  margin-left: ${theme.spacing.md}px;
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.lg}px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
  opacity: ${(props: { disabled: boolean }) => props.disabled ? 0.7 : 1};
`;

const SuccessMessage = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const SuccessContent = styled.View`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.lg}px;
  border-radius: ${theme.borderRadius.xl}px;
  border: 3px solid ${theme.colors.primary};
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 0px 8px;
  shadow-opacity: 0.5;
  shadow-radius: 16px;
  elevation: 12;
  min-width: 220px;
`;

const SuccessIcon = styled.Text`
  font-size: 32px;
  margin-bottom: ${theme.spacing.sm}px;
`;

const SuccessText = styled.Text`
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${theme.spacing.xs}px;
`;

const SuccessSubtext = styled.Text`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.sm}px;
  text-align: center;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm}px 0;
  margin-bottom: ${theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.borderLight};
`;

const InfoLabel = styled(CaptionText)`
  color: ${theme.colors.textSecondary};
`;

const InfoValue = styled(BodyText)`
  font-weight: ${theme.typography.fontWeight.medium};
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
                <Text style={{ fontSize: 20, color: theme.colors.textPrimary }}>✕</Text>
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

                  {/* Pizza Info */}
                  <InfoRow>
                    <InfoLabel>Preparation Time</InfoLabel>
                    <InfoValue>⏱️ {pizza.preparationTime} minutes</InfoValue>
                  </InfoRow>

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
                            <Text style={{ color: 'white', fontSize: 10, lineHeight: 20 }}>✓</Text>
                          )}
                        </ToppingCheckbox>
                        <ToppingText>{topping.name}</ToppingText>
                        <ToppingPrice>+${topping.price.toFixed(2)}</ToppingPrice>
                      </ToppingItem>
                    ))}
                  </ToppingsContainer>

                  {/* Spacer for bottom bar */}
                  <View style={{ height: 320 }} />

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