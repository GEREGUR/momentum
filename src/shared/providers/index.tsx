import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { GluestackUIProvider } from "../ui/gluestack-ui-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <GluestackUIProvider mode="dark">{children}</GluestackUIProvider>
    </QueryClientProvider>
  );
}
