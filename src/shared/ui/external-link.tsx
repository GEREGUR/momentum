import { type PropsWithChildren } from 'react';
import { Linking, Pressable } from 'react-native';

type ExternalLinkProps = PropsWithChildren<{
  href: string;
  asChild?: boolean;
}>;

export function ExternalLink({ href, children, asChild, ...rest }: ExternalLinkProps) {
  if (asChild) {
    return (
      <Pressable
        onPress={() => Linking.openURL(href)}
        {...rest}>
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => Linking.openURL(href)}
      className="flex-row items-center"
      {...rest}>
      {children}
    </Pressable>
  );
}
