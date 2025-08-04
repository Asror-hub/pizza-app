import React, { useState, useRef } from 'react';
import { FlatList, Animated, View } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../styles/theme';
import { Pizza } from '../types';
import { pizzas, getPizzasByCategory, searchPizzas } from '../data/pizzas';
import { 
  SafeContainer, 
  PaddingContainer, 
  Title, 
  Subtitle, 
  BodyText, 
  CaptionText,
  Row,
  EmptyContainer,
  EmptyText
} from '../styles/styled';
import PizzaCard from '../components/PizzaCard';
import Header from '../components/Header';

interface HomeScreenProps {
  onAddToCart: (pizza: Pizza, quantity?: number, size?: 'small' | 'medium' | 'large') => void;
  onCartPress: () => void;
  onPizzaPress: (pizza: Pizza) => void;
  cartItemCount: number;
}

const CategoryFilter = styled.ScrollView`
  margin-bottom: ${theme.spacing.lg}px;
  padding-left: ${theme.spacing.xs}px;
`;

const CategoryButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  margin-right: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.round}px;
  background-color: ${(props: { active: boolean }) => props.active ? theme.colors.primary : theme.colors.backgroundTertiary};
  border: 1px solid ${(props: { active: boolean }) => props.active ? theme.colors.primary : theme.colors.border};
  flex-direction: row;
  align-items: center;
  min-height: 36px;
`;

const CategoryButtonText = styled.Text<{ active: boolean }>`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${(props: { active: boolean }) => props.active ? theme.colors.textInverse : theme.colors.textPrimary};
  margin-left: 6px;
  letter-spacing: 0.3px;
`;

const CategoryImage = styled.Image`
  width: 16px;
  height: 16px;
  border-radius: 8px;
`;

const SectionTitle = styled.Text`
  font-size: ${theme.typography.fontSize.xl}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.md}px;
  letter-spacing: -0.5px;
`;

const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xxxl}px;
`;

const EmptyStateText = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin-top: ${theme.spacing.md}px;
`;

const EmptyStateSubtext = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.textTertiary};
  text-align: center;
  margin-top: ${theme.spacing.sm}px;
`;

const HomeScreen: React.FC<HomeScreenProps> = ({ onAddToCart, onCartPress, onPizzaPress, cartItemCount }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation values for header only
  const headerOpacity = useRef(new Animated.Value(1)).current;
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'classic', label: 'Classic' },
    { id: 'premium', label: 'Premium' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'spicy', label: 'Spicy' },
  ];

  // Filter pizzas by category and search query
  const getFilteredPizzas = () => {
    let filtered = selectedCategory === 'all' 
      ? pizzas 
      : getPizzasByCategory(selectedCategory as Pizza['category']);
    
    if (searchQuery.trim()) {
      // Use the search function for better results
      const searchResults = searchPizzas(searchQuery);
      // Intersect with category filter
      filtered = filtered.filter(pizza => 
        searchResults.some(searchPizza => searchPizza.id === pizza.id)
      );
    }
    
    return filtered;
  };

  const filteredPizzas = getFilteredPizzas();

  const handleSearchPress = () => {
    setIsSearchMode(true);
  };

  const handleSearchCancel = () => {
    setIsSearchMode(false);
    setSearchQuery('');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    // Search is already live, so just hide keyboard
    setIsSearchMode(false);
  };

  const handleScroll = (event: any) => {
    // Header scroll animation could be added here
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const renderPizzaItem = ({ item, index }: { item: Pizza; index: number }) => (
    <PizzaCard
      pizza={item}
      onAddToCart={onAddToCart}
      onPress={onPizzaPress}
      index={index}
    />
  );

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <EmptyStateText>🍕 No pizzas found</EmptyStateText>
      <EmptyStateSubtext>
        {searchQuery.trim() 
          ? `No pizzas match "${searchQuery}"`
          : `No pizzas in the ${selectedCategory} category`
        }
      </EmptyStateSubtext>
    </EmptyStateContainer>
  );

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Header
        cartItemCount={cartItemCount}
        onSearchPress={handleSearchPress}
        isSearchMode={isSearchMode}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchCancel={handleSearchCancel}
      />
      
      <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
        {/* Category Filter - Hide when searching */}
        {!isSearchMode && (
          <View style={{ paddingLeft: theme.spacing.xs, marginTop: theme.spacing.md }}>
            <CategoryFilter
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: theme.spacing.lg }}
            >
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  active={selectedCategory === category.id}
                  onPress={() => handleCategoryPress(category.id)}
                  activeOpacity={0.7}
                >
                  <CategoryImage source={require('../../assets/images/pizza_1.png')} />
                  <CategoryButtonText active={selectedCategory === category.id}>
                    {category.label}
                  </CategoryButtonText>
                </CategoryButton>
              ))}
            </CategoryFilter>
          </View>
        )}
        
        <View style={{ paddingHorizontal: theme.spacing.md, flex: 1 }}>
          {isSearchMode && searchQuery.trim() && (
            <SectionTitle>Search Results</SectionTitle>
          )}
          <FlatList
            data={filteredPizzas}
            renderItem={renderPizzaItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={{ paddingBottom: theme.spacing.xxxl }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen; 