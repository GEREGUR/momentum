import { type ReactNode } from 'react';
import { View, Text } from 'react-native';

import { useTheme } from '@/shared/theme';

type HintRowProps = {
  title: string;
  hint: ReactNode;
};

export function HintRow({ title, hint }: HintRowProps) {
  const theme = useTheme();

  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-sm font-semibold" style={{ color: theme.text }}>{title}</Text>
      <View className="flex-1 items-end">{hint}</View>
    </View>
  );
}
