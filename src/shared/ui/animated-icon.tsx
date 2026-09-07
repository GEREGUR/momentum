import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

import { useTheme } from '@/shared/theme';

export function AnimatedIcon() {
  const theme = useTheme();
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  rotation.value = withRepeat(
    withTiming(360, { duration: 2000, easing: Easing.linear }),
    -1,
    false,
  );

  return (
    <View className="w-[120px] h-[120px] rounded-[60px] justify-center items-center" style={{ backgroundColor: theme.backgroundElement }}>
      <Animated.View className="w-[60px] h-[60px] rounded-[30px] bg-[#0a7ea4]" style={animatedStyle} />
    </View>
  );
}

export function AnimatedSplashOverlay() {
  return null;
}
