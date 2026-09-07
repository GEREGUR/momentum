import { View, Text } from 'react-native';

import { useTheme } from '@/shared/theme';

export function WebBadge() {
  const theme = useTheme();

  return (
    <View className="px-3 py-1.5 rounded-2xl self-center" style={{ backgroundColor: theme.backgroundElement }}>
      <Text className="text-xs font-semibold" style={{ color: theme.textSecondary }}>Web</Text>
    </View>
  );
}
