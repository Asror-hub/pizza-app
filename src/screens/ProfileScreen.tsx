import React, { useRef } from 'react';
import { ScrollView, Animated } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../styles/theme';
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

const ProfileScreen: React.FC = () => {
  // Animation values for scroll effects
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const profileCardOpacity = useRef(new Animated.Value(1)).current;
  const profileCardScale = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    
    // Animate header and profile card based on scroll
    if (offsetY > 50) {
      // Scale down profile card when scrolling down
      Animated.parallel([
        Animated.timing(profileCardScale, {
          toValue: 0.98,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(profileCardOpacity, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Scale up profile card when scrolling up
      Animated.parallel([
        Animated.timing(profileCardScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(profileCardOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const renderOptionItem = (option: any, index: number) => {
    return (
      <OptionCard>
        <OptionIcon>{option.icon}</OptionIcon>
        <OptionContent>
          <OptionTitle>{option.title}</OptionTitle>
          <OptionSubtitle>{option.subtitle}</OptionSubtitle>
        </OptionContent>
        <OptionArrow>→</OptionArrow>
      </OptionCard>
    );
  };

  const profileOptions = [
    {
      icon: '👤',
      title: 'Personal Information',
      subtitle: 'Update your name, email, and phone number'
    },
    {
      icon: '📍',
      title: 'Delivery Addresses',
      subtitle: 'Manage your saved delivery addresses'
    },
    {
      icon: '💳',
      title: 'Payment Methods',
      subtitle: 'Add or remove payment options'
    },
    {
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Customize your notification preferences'
    },
    {
      icon: '🎁',
      title: 'Loyalty Program',
      subtitle: 'View your points and rewards'
    },
    {
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'Get help with your orders'
    },
    {
      icon: '⚙️',
      title: 'Settings',
      subtitle: 'App preferences and account settings'
    }
  ];

  return (
    <SafeContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <PaddingContainer>
          {/* Header */}
          <Animated.View
            style={{
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            }}
          >
            <Title>Account</Title>
            <Subtitle>Manage your profile and preferences</Subtitle>
          </Animated.View>

          {/* Profile Card */}
          <Animated.View
            style={{
              opacity: profileCardOpacity,
              transform: [{ scale: profileCardScale }],
            }}
          >
            <ProfileCard>
              <ProfileAvatar>🍕</ProfileAvatar>
              <ProfileInfo>
                <ProfileName>Pizza Lover</ProfileName>
                <ProfileEmail>pizza.lover@example.com</ProfileEmail>
                <ProfileStats>
                  <StatItem>
                    <StatNumber>12</StatNumber>
                    <StatLabel>Orders</StatLabel>
                  </StatItem>
                  <StatDivider />
                  <StatItem>
                    <StatNumber>450</StatNumber>
                    <StatLabel>Points</StatLabel>
                  </StatItem>
                  <StatDivider />
                  <StatItem>
                    <StatNumber>3</StatNumber>
                    <StatLabel>Addresses</StatLabel>
                  </StatItem>
                </ProfileStats>
              </ProfileInfo>
            </ProfileCard>
          </Animated.View>

          {/* Options List */}
          <OptionsSection>
            <SectionTitle>Account Settings</SectionTitle>
            {profileOptions.map((option, index) => (
              <React.Fragment key={`option-${index}`}>
                {renderOptionItem(option, index)}
              </React.Fragment>
            ))}
          </OptionsSection>

          {/* Logout Section */}
          <LogoutSection>
            <LogoutCard>
              <LogoutIcon>🚪</LogoutIcon>
              <LogoutContent>
                <LogoutTitle>Sign Out</LogoutTitle>
                <LogoutSubtitle>Sign out of your account</LogoutSubtitle>
              </LogoutContent>
              <LogoutArrow>→</LogoutArrow>
            </LogoutCard>
          </LogoutSection>
        </PaddingContainer>
      </ScrollView>
    </SafeContainer>
  );
};

// Styled components
const ProfileCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.xl}px;
  border: 1px solid ${theme.colors.borderLight};
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  flex-direction: row;
  align-items: center;
`;

const ProfileAvatar = styled.Text`
  font-size: 60px;
  margin-right: ${theme.spacing.lg}px;
`;

const ProfileInfo = styled.View`
  flex: 1;
`;

const ProfileName = styled.Text`
  font-size: ${theme.typography.fontSize.xl}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const ProfileEmail = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.md}px;
`;

const ProfileStats = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StatItem = styled.View`
  align-items: center;
  flex: 1;
`;

const StatNumber = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: 2px;
`;

const StatLabel = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatDivider = styled.View`
  width: 1px;
  height: 30px;
  background-color: ${theme.colors.borderLight};
  margin: 0 ${theme.spacing.sm}px;
`;

const OptionsSection = styled.View`
  margin-bottom: ${theme.spacing.xl}px;
`;

const SectionTitle = styled.Text`
  font-size: ${theme.typography.fontSize.lg}px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.md}px;
`;

const OptionCard = styled.TouchableOpacity`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.sm}px;
  border: 1px solid ${theme.colors.borderLight};
  shadow-color: rgba(0, 0, 0, 0.05);
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 1;
  flex-direction: row;
  align-items: center;
`;

const OptionIcon = styled.Text`
  font-size: 24px;
  margin-right: ${theme.spacing.md}px;
`;

const OptionContent = styled.View`
  flex: 1;
`;

const OptionTitle = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
  margin-bottom: 2px;
`;

const OptionSubtitle = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.textSecondary};
`;

const OptionArrow = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const LogoutSection = styled.View`
  margin-bottom: ${theme.spacing.xxl}px;
`;

const LogoutCard = styled.TouchableOpacity`
  background-color: ${theme.colors.error}10;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const LogoutIcon = styled.Text`
  font-size: 24px;
  margin-right: ${theme.spacing.md}px;
`;

const LogoutContent = styled.View`
  flex: 1;
`;

const LogoutTitle = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.error};
  margin-bottom: 2px;
`;

const LogoutSubtitle = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.textSecondary};
`;

const LogoutArrow = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.error};
  font-weight: ${theme.typography.fontWeight.medium};
`;

export default ProfileScreen; 