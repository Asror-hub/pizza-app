import styled from 'styled-components/native';
import { theme } from './theme';

// Container components
export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const PaddingContainer = styled.View`
  padding: ${theme.spacing.md}px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Column = styled.View`
  flex-direction: column;
`;

export const CenterContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// Text components
export const Title = styled.Text`
  font-size: ${theme.typography.fontSize.xxl}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm}px;
`;

export const Subtitle = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs}px;
`;

export const BodyText = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  font-weight: ${theme.typography.fontWeight.regular};
  color: ${theme.colors.textPrimary};
  line-height: ${theme.typography.lineHeight.normal * theme.typography.fontSize.md}px;
`;

export const CaptionText = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.regular};
  color: ${theme.colors.textSecondary};
`;

export const PriceText = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

// Button components
export const PrimaryButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.md}px ${theme.spacing.lg}px;
  border-radius: ${theme.borderRadius.md}px;
  align-items: center;
  justify-content: center;
  min-height: ${theme.layout.buttonHeight}px;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 4;
`;

export const SecondaryButton = styled.TouchableOpacity`
  background-color: transparent;
  padding: ${theme.spacing.md}px ${theme.spacing.lg}px;
  border-radius: ${theme.borderRadius.md}px;
  border: 2px solid ${theme.colors.primary};
  align-items: center;
  justify-content: center;
  min-height: ${theme.layout.buttonHeight}px;
`;

export const ButtonText = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textInverse};
`;

export const SecondaryButtonText = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.primary};
`;

// Card components
export const Card = styled.View`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
  elevation: 2;
`;

export const ElevatedCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 4;
`;

// Input components
export const Input = styled.TextInput`
  background-color: ${theme.colors.backgroundSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.textPrimary};
  min-height: ${theme.layout.inputHeight}px;
`;

export const InputLabel = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs}px;
`;

// Divider
export const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.border};
  margin: ${theme.spacing.md}px 0;
`;

// Badge
export const Badge = styled.View`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.round}px;
  align-self: flex-start;
`;

export const BadgeText = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textInverse};
`;

// Status indicators
export const StatusIndicator = styled.View<{ status: 'success' | 'error' | 'warning' | 'info' }>`
  width: 8px;
  height: 8px;
  border-radius: ${theme.borderRadius.round}px;
  background-color: ${(props: { status: 'success' | 'error' | 'warning' | 'info' }) => theme.colors[props.status]};
`;

// Image container
export const ImageContainer = styled.View`
  width: 100%;
  height: 200px;
  border-radius: ${theme.borderRadius.lg}px;
  overflow: hidden;
  background-color: ${theme.colors.backgroundSecondary};
`;

// Loading spinner container
export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.background};
`;

// Empty state container
export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xxl}px;
`;

export const EmptyText = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin-top: ${theme.spacing.md}px;
`; 