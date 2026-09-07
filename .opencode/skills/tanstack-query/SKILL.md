---
name: tanstack-query
description: TanStack Query for server state management, caching, and data fetching in React Native.
---

# TanStack Query

This skill covers TanStack Query (React Query) for managing server state in React Native apps.

## When to Use

Use this skill when:
- Fetching data from APIs
- Caching server responses
- Managing loading and error states
- Implementing infinite scroll/pagination
- Optimistic updates

## Core Principles

### 1. QueryClient Setup
```tsx
// src/app/providers/query-provider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 2. Query Keys
```tsx
// Consistent query key factory
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

### 3. Use Query Hook
```tsx
import { useQuery } from '@tanstack/react-query';
import { userKeys } from './query-keys';

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}

// Usage in component
function UserScreen({ id }: { id: string }) {
  const { data: user, isLoading, error } = useUser(id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <UserProfile user={user} />;
}
```

### 4. Use Mutation Hook
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => updateUser(data),
    onMutate: async (newData) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: userKeys.detail(newData.id),
      });

      const previousUser = queryClient.getQueryData(
        userKeys.detail(newData.id)
      );

      queryClient.setQueryData(
        userKeys.detail(newData.id),
        (old) => ({ ...old, ...newData })
      );

      return { previousUser };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(
        userKeys.detail(newData.id),
        context?.previousUser
      );
    },
    onSettled: (data, error, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
  });
}
```

### 5. Infinite Queries
```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => getPosts({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
  });
}

// Usage
function PostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();

  return (
    <FlatList
      data={data?.pages.flatMap((page) => page.items)}
      renderItem={({ item }) => <PostCard post={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
}
```

## React Native Specific Patterns

### Offline Support
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 24 * 60 * 60 * 1000, // 24 hours for offline
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### Persistent Cache
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
```

### Integration with Effect.ts
```tsx
import { Effect } from 'effect';

// Wrap API calls in Effect
const fetchUserEffect = (id: string) =>
  Effect.tryPromise({
    try: () => fetch(`/api/users/${id}`).then((r) => r.json()),
    catch: (error) => new ApiError({ cause: error }),
  });

// Use in query
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => Effect.runPromise(fetchUserEffect(id)),
  });
}
```

## Anti-Patterns

- ❌ Using `any` in query/mutation functions
- ❌ Not invalidating queries after mutations
- ❌ Missing optimistic updates for better UX
- ❌ Not handling offline state
- ❌ Hardcoded query keys
- ❌ Storing client state in Query cache

## Benefits

- Automatic caching and deduplication
- Background refetching
- Optimistic updates
- Offline support
- Pagination and infinite scroll
- TypeScript integration
