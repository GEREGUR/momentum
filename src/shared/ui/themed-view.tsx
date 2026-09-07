import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/shared/theme';

type ThemedViewProps = ViewProps & {
  type?: 'default' | 'backgroundElement';
};

export function ThemedView({ style, type = 'default', ...rest }: ThemedViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: type === 'backgroundElement' ? theme.backgroundElement : theme.background,
        },
        style,
      ]}
      {...rest}
    />
  );
}
