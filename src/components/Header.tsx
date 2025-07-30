import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../styles/theme';
import { restaurantInfo } from '../data/restaurant';

interface HeaderProps {
  cartItemCount: number;
  onSearchPress: () => void;
  showSearch?: boolean;
  showBack?: boolean;
  isSearchMode?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: () => void;
  onSearchCancel?: () => void;
}

const HeaderContainer = styled(Animated.View)`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.md}px ${theme.spacing.lg}px;
  padding-top: ${theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.borderLight};
  shadow-color: rgba(0, 0, 0, 0.05);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BrandSection = styled.View`
  flex: 1;
`;

const RestaurantName = styled.Text`
  font-size: ${theme.typography.fontSize.xl}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: 2px;
`;

const RestaurantTagline = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.regular};
  color: ${theme.colors.textSecondary};
`;

const ActionButton = styled.TouchableOpacity`
  position: relative;
  padding: ${theme.spacing.sm}px;
  background-color: ${theme.colors.backgroundSecondary};
  border-radius: ${theme.borderRadius.round}px;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${theme.colors.border};
`;

const ActionIcon = styled.Text`
  font-size: 20px;
  color: ${theme.colors.textPrimary};
`;

const CartBadge = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${theme.colors.primary};
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  border: 2px solid ${theme.colors.background};
`;

const CartBadgeText = styled.Text`
  font-size: 10px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textInverse};
`;

const DeliveryInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${theme.spacing.sm}px;
`;

const DeliveryIcon = styled.Text`
  font-size: 14px;
  margin-right: ${theme.spacing.xs}px;
`;

const DeliveryText = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const SearchContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.backgroundSecondary};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border: 1px solid ${theme.colors.border};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.textPrimary};
  margin-left: ${theme.spacing.sm}px;
`;

const SearchIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
`;

const CancelButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px;
  margin-left: ${theme.spacing.sm}px;
`;

const CancelText = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const Header: React.FC<HeaderProps> = ({ 
  cartItemCount, 
  onSearchPress, 
  showSearch = true, 
  showBack = false,
  isSearchMode = false,
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onSearchCancel
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cartBadgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Animate cart badge when count changes
    if (cartItemCount > 0) {
      Animated.sequence([
        Animated.timing(cartBadgeScale, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(cartBadgeScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartItemCount]);

  if (isSearchMode) {
    return (
      <HeaderContainer
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <HeaderContent>
          <SearchContainer>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              placeholder="Search pizzas..."
              value={searchQuery}
              onChangeText={onSearchChange}
              onSubmitEditing={onSearchSubmit}
              autoFocus
              returnKeyType="search"
            />
          </SearchContainer>
          <CancelButton onPress={onSearchCancel}>
            <CancelText>Cancel</CancelText>
          </CancelButton>
        </HeaderContent>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <HeaderContent>
        <BrandSection>
          <RestaurantName>🍕 Pizza Palace</RestaurantName>
          <RestaurantTagline>Delicious pizzas delivered to your door</RestaurantTagline>
          <DeliveryInfo>
            <DeliveryIcon>🚚</DeliveryIcon>
            <DeliveryText>
              Free delivery within 2km
            </DeliveryText>
          </DeliveryInfo>
        </BrandSection>
        
        {showSearch && (
          <ActionButton onPress={onSearchPress} activeOpacity={0.7}>
            <ActionIcon>🔍</ActionIcon>
          </ActionButton>
        )}
        
        {showBack && (
          <ActionButton onPress={onSearchPress} activeOpacity={0.7}>
            <ActionIcon>←</ActionIcon>
          </ActionButton>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 