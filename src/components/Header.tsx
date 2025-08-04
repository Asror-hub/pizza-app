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
  background-color: ${theme.colors.backgroundSecondary};
  padding: ${theme.spacing.lg}px ${theme.spacing.lg}px ${theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  position: relative;
  overflow: hidden;
`;

const GlassBackground = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.glass.background};
  border-bottom-width: 1px;
  border-bottom-color: ${theme.glass.border};
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const BrandSection = styled.View`
  flex: 1;
`;

const RestaurantName = styled.Text`
  font-size: ${theme.typography.fontSize.xxl}px;
  font-weight: ${theme.typography.fontWeight.extrabold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs}px;
  letter-spacing: -0.5px;
`;

const DeliveryInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${theme.spacing.xs}px;
`;

const DeliveryIcon = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  margin-right: ${theme.spacing.xs}px;
`;

const DeliveryText = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const ActionButton = styled.TouchableOpacity`
  position: relative;
  padding: ${theme.spacing.sm}px;
  background-color: ${theme.colors.backgroundTertiary};
  border-radius: ${theme.borderRadius.round}px;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${theme.colors.border};
  margin-left: ${theme.spacing.sm}px;
`;

const ActionIcon = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.textPrimary};
`;

const CartBadge = styled.View`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: ${theme.colors.secondary};
  border-radius: ${theme.borderRadius.round}px;
  min-width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
  border: 2px solid ${theme.colors.backgroundSecondary};
`;

const CartBadgeText = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textInverse};
`;

const SearchContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.backgroundTertiary};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  border: 1px solid ${theme.colors.border};
  margin-right: ${theme.spacing.md}px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.textPrimary};
  margin-left: ${theme.spacing.sm}px;
`;

const SearchIcon = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.textSecondary};
`;

const CancelButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  background-color: ${theme.colors.backgroundTertiary};
  border-radius: ${theme.borderRadius.md}px;
  border: 1px solid ${theme.colors.border};
`;

const CancelText = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.textPrimary};
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
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Animate cart badge when count changes
    if (cartItemCount > 0) {
      Animated.sequence([
        Animated.timing(cartBadgeScale, {
          toValue: 1.2,
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
        <GlassBackground />
        <HeaderContent>
          <SearchContainer>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              placeholder="Search pizzas..."
              placeholderTextColor={theme.colors.textTertiary}
              value={searchQuery}
              onChangeText={onSearchChange}
              onSubmitEditing={onSearchSubmit}
              autoFocus
              returnKeyType="search"
            />
          </SearchContainer>
          <CancelButton onPress={onSearchCancel} activeOpacity={0.7}>
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
      <GlassBackground />
      <HeaderContent>
        <BrandSection>
          <RestaurantName>🍕 Pizza Palace</RestaurantName>
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