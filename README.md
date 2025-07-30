# Pizza Shop App

A beautiful React Native pizza ordering app with smooth animations and modern UI.

## Features

- 🍕 Browse delicious pizzas with high-quality images
- 🛒 Add items to cart with smooth animations
- 📱 Responsive design with modern UI components
- 🎨 Beautiful screen transitions and micro-interactions
- 🔍 Search functionality for finding your favorite pizzas
- 📋 Order tracking and history
- 👤 User profile management

## Screen Animations

The app features several types of smooth screen transition animations:

### Screen Transitions
- **Slide**: Horizontal slide transition (used for cart navigation)
- **Fade**: Smooth fade in/out (used for home and profile navigation)
- **Scale**: Scale down/up with fade (used for orders screen)
- **Slide Up**: Vertical slide from bottom (used for checkout)

### Modal Animations
- **Pizza Details**: Slide up from bottom with scale and fade effects
- **Smooth backdrop**: Semi-transparent overlay with touch-to-close

### Micro-interactions
- **Tab Bar**: Spring animations on button press
- **Cart Badge**: Bounce animation when items are added
- **Pizza Cards**: Staggered entrance animations with slide and fade
- **Add to Cart Button**: Scale animation on press

### Animation Utilities

The app includes a comprehensive animation utility system in `src/utils/animations.ts`:

```typescript
import { animationUtils } from '../utils/animations';

// Screen transitions
animationUtils.slideTransition(slideAnim, fadeAnim);
animationUtils.fadeTransition(fadeAnim);
animationUtils.scaleTransition(scaleAnim, fadeAnim);
animationUtils.slideUpTransition(slideAnim, fadeAnim);

// Modal animations
animationUtils.openModal(fadeAnim, slideAnim, scaleAnim);
animationUtils.closeModal(fadeAnim, slideAnim, scaleAnim);

// Button animations
animationUtils.buttonPress(scaleAnim);
animationUtils.buttonRelease(scaleAnim);

// Badge animations
animationUtils.badgeBounce(scaleAnim);
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
npm run android
# or
npm run ios
# or
npm run web
```

## Technologies Used

- React Native
- TypeScript
- Styled Components
- React Navigation
- Expo
- React Native Animated API

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── data/              # Mock data and utilities
├── styles/            # Theme and styled components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions including animations
```

## Contributing

Feel free to submit issues and enhancement requests! 