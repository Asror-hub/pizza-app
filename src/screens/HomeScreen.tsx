import React, { useState, useRef } from 'react';
import { FlatList, Animated } from 'react-native';
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
`;

const CategoryButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  margin-right: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.round}px;
  background-color: ${(props: { active: boolean }) => props.active ? theme.colors.primary : theme.colors.backgroundSecondary};
  border: 1px solid ${(props: { active: boolean }) => props.active ? theme.colors.primary : theme.colors.border};
`;

const CategoryButtonText = styled.Text<{ active: boolean }>`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${(props: { active: boolean }) => props.active ? theme.colors.textInverse : theme.colors.textPrimary};
  padding-bottom: 2px;
`;

const SectionTitle = styled(Title)`
  margin-bottom: ${theme.spacing.md}px;
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
    // Scroll handler for pizza card animations only
    // Category filter animations removed
  };

  const handleCategoryPress = (categoryId: string) => {
    // Animate category selection
    setSelectedCategory(categoryId);
    
    // Add a subtle animation to the selected category
    const selectedButton = categories.find(cat => cat.id === categoryId);
    if (selectedButton) {
      // You could add more animation logic here if needed
    }
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
    <EmptyContainer>
      <EmptyText>
        {searchQuery.trim() 
          ? `No pizzas found for "${searchQuery}"`
          : 'No pizzas found in this category'
        }
      </EmptyText>
    </EmptyContainer>
  );

  return (
    <SafeContainer>
      <Header 
        cartItemCount={cartItemCount}
        onSearchPress={handleSearchPress}
        isSearchMode={isSearchMode}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchCancel={handleSearchCancel}
      />
      <PaddingContainer style={{ backgroundColor: theme.colors.backgroundSecondary }}>
        {/* Category Filter - Hide when searching */}
        {!isSearchMode && (
          <CategoryFilter horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                active={selectedCategory === category.id}
                onPress={() => handleCategoryPress(category.id)}
              >
                <CategoryButtonText active={selectedCategory === category.id}>
                  {category.label}
                </CategoryButtonText>
              </CategoryButton>
            ))}
          </CategoryFilter>
        )}

        {/* Pizza List */}
        {isSearchMode && searchQuery.trim() && (
          <SectionTitle>Search Results</SectionTitle>
        )}
        <FlatList
          data={filteredPizzas}
          renderItem={renderPizzaItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </PaddingContainer>
    </SafeContainer>
  );
};

export default HomeScreen; 