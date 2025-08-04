import { Pizza } from '../types';

export const pizzas: Pizza[] = [
  {
    id: '1',
    name: 'Margherita Classic',
    description: 'Fresh mozzarella, tomato sauce, and basil - the timeless Italian favorite',
    price: 12.99,
    image: require('../../assets/images/pizza_1.png'),
    category: 'classic',
    ingredients: ['Fresh mozzarella', 'Tomato sauce', 'Fresh basil', 'Olive oil'],
    size: 'medium',
    isAvailable: true,
    preparationTime: 15
  },
  {
    id: '2',
    name: 'Pepperoni Supreme',
    description: 'Spicy pepperoni with melted cheese and our signature tomato sauce',
    price: 16.99,
    image: require('../../assets/images/pizza_2.png'),
    category: 'classic',
    ingredients: ['Pepperoni', 'Mozzarella cheese', 'Tomato sauce', 'Oregano'],
    size: 'medium',
    isAvailable: true,
    preparationTime: 18
  },
  {
    id: '3',
    name: 'BBQ Chicken Deluxe',
    description: 'Grilled chicken with BBQ sauce, red onions, and cilantro',
    price: 19.99,
    image: require('../../assets/images/pizza_3.png'),
    category: 'premium',
    ingredients: ['Grilled chicken', 'BBQ sauce', 'Red onions', 'Cilantro', 'Mozzarella'],
    size: 'medium',
    isAvailable: true,
    preparationTime: 20
  },
  {
    id: '4',
    name: 'Veggie Garden',
    description: 'Fresh bell peppers, mushrooms, onions, and olives on a crispy crust',
    price: 14.99,
    image: require('../../assets/images/pizza_1.png'),
    category: 'vegetarian',
    ingredients: ['Bell peppers', 'Mushrooms', 'Onions', 'Olives', 'Mozzarella', 'Tomato sauce'],
    size: 'medium',
    isAvailable: true,
    preparationTime: 16
  },
  {
    id: '5',
    name: 'Spicy Jalapeño',
    description: 'Hot jalapeños with spicy chicken and extra cheese for heat lovers',
    price: 18.99,
    image: require('../../assets/images/pizza_2.png'),
    category: 'spicy',
    ingredients: ['Jalapeños', 'Spicy chicken', 'Extra cheese', 'Hot sauce', 'Tomato sauce'],
    size: 'medium',
    isAvailable: true,
    preparationTime: 22
  },
  {
    id: '6',
    name: 'Hawaiian Paradise',
    description: 'Ham and pineapple with a sweet and savory combination',
    price: 17.99,
    image: require('../../assets/images/pizza_3.png'),
    category: 'classic',
    ingredients: ['Ham', 'Pineapple', 'Mozzarella', 'Tomato sauce'],
    size: 'medium',
    isAvailable: true,
    preparationTime: 17
  },
  {
    id: '7',
    name: 'Truffle Mushroom',
    description: 'Wild mushrooms with truffle oil and aged parmesan',
    price: 22.99,
    image: require('../../assets/images/pizza_1.png'),
    category: 'premium',
    ingredients: ['Wild mushrooms', 'Truffle oil', 'Aged parmesan', 'Mozzarella', 'Garlic'],
    size: 'medium',
    isAvailable: true,
    preparationTime: 25
  },
  {
    id: '8',
    name: 'Buffalo Chicken',
    description: 'Spicy buffalo chicken with ranch drizzle and celery',
    price: 20.99,
    image: require('../../assets/images/pizza_2.png'),
    category: 'spicy',
    ingredients: ['Buffalo chicken', 'Ranch drizzle', 'Celery', 'Blue cheese', 'Mozzarella'],
    size: 'medium',
    isAvailable: true,
    preparationTime: 21
  }
];

export const getPizzasByCategory = (category: Pizza['category']) => {
  return pizzas.filter(pizza => pizza.category === category);
};

export const getPizzaById = (id: string) => {
  return pizzas.find(pizza => pizza.id === id);
};

export const searchPizzas = (query: string) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return pizzas;
  
  return pizzas.filter(pizza => 
    pizza.name.toLowerCase().includes(searchTerm) ||
    pizza.description.toLowerCase().includes(searchTerm) ||
    pizza.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchTerm)
    ) ||
    pizza.category.toLowerCase().includes(searchTerm)
  );
}; 