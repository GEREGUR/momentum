import { Text, type TextProps } from 'react-native';

import { useTheme, Fonts } from '@/shared/theme';

type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'small' | 'smallBold' | 'code' | 'link' | 'linkPrimary';
  themeColor?: string;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color = themeColor ? (theme as Record<string, string>)[themeColor] ?? theme.text : theme.text;

  const typeClasses = {
    default: 'text-base leading-6',
    title: 'text-[32px] font-bold leading-10',
    subtitle: 'text-2xl font-semibold leading-8',
    small: 'text-sm leading-5',
    smallBold: 'text-sm leading-5 font-semibold',
    code: 'text-sm leading-5',
    link: 'text-base leading-6 text-[#0a7ea4]',
    linkPrimary: 'text-base leading-6 text-[#0a7ea4]',
  };

  return (
    <Text
      className={typeClasses[type]}
      style={[
        { color },
        type === 'code' && { fontFamily: Fonts.mono },
        style,
      ]}
      {...rest}
    />
  );
}
