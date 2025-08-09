# Navigation Loading System

This document describes the global navigation loading system that shows a spinner whenever users navigate between pages.

## Overview

The navigation loading system provides a consistent user experience by showing a loading spinner during page transitions. It's similar to the existing logout spinner but works for all navigation actions.

## Components

### 1. NavigationContext (`src/contexts/NavigationContext.tsx`)
Provides global state management for navigation loading.

```typescript
const { isNavigating, setIsNavigating, navigationMessage, setNavigationMessage } = useNavigation();
```

### 2. NavigationSpinner (`src/components/NavigationSpinner/index.tsx`)
The visual spinner component that appears during navigation.

### 3. useNavigationLoader Hook (`src/hooks/useNavigationLoader.ts`)
Basic hook for controlling navigation loading.

```typescript
const { navigateWithLoader, replaceWithLoader, showLoader, hideLoader } = useNavigationLoader();
```

### 4. useSmartNavigation Hook (`src/utils/navigationUtils.ts`)
Enhanced hook with automatic message detection based on the destination path.

```typescript
const { smartNavigate, smartReplace } = useSmartNavigation();
```

## Usage Examples

### Basic Navigation with Loading
```typescript
import { useNavigationLoader } from '@/hooks/useNavigationLoader';

const MyComponent = () => {
  const { navigateWithLoader } = useNavigationLoader();
  
  const handleClick = () => {
    navigateWithLoader('/dashboard', 'Loading dashboard...');
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
};
```

### Smart Navigation (Recommended)
```typescript
import { useSmartNavigation } from '@/utils/navigationUtils';

const MyComponent = () => {
  const { smartNavigate } = useSmartNavigation();
  
  const handleClick = () => {
    // Automatically detects appropriate message based on path
    smartNavigate('/vendor/dashboard'); // Shows "Loading vendor dashboard..."
  };
  
  return <button onClick={handleClick}>Go to Vendor Dashboard</button>;
};
```

### Manual Loader Control
```typescript
import { useSmartNavigation } from '@/utils/navigationUtils';

const MyComponent = () => {
  const { showLoader, hideLoader, smartNavigate } = useSmartNavigation();
  
  const handleComplexOperation = async () => {
    showLoader('Processing your request...');
    
    try {
      await someAsyncOperation();
      smartNavigate('/success-page');
    } catch (error) {
      hideLoader();
      // Handle error
    }
  };
  
  return <button onClick={handleComplexOperation}>Process & Navigate</button>;
};
```

## Automatic Message Detection

The system automatically detects appropriate loading messages based on the destination path:

- `/admin/*` → "Loading admin panel..."
- `/vendor/*` → "Loading vendor dashboard..."
- `/buyer/*` → "Loading buyer dashboard..."
- `/marketplace` → "Loading marketplace..."
- `/login` → "Redirecting to login..."
- `/register` → "Loading registration..."
- `/dashboard` → "Loading dashboard..."
- And many more...

## Integration

The system is automatically integrated into your app through the `NavigationProvider` in `src/app/providers.tsx`. The `NavigationSpinner` component is globally available and will show whenever navigation is in progress.

## Migration Guide

### Before (Old Way)
```typescript
const router = useRouter();

const handleClick = () => {
  router.push('/dashboard');
};
```

### After (New Way)
```typescript
const { smartNavigate } = useSmartNavigation();

const handleClick = () => {
  smartNavigate('/dashboard');
};
```

## Customization

### Custom Messages
You can override the automatic message detection:

```typescript
smartNavigate('/custom-page', 'Loading your custom content...');
```

### Custom Spinner Duration
The default spinner shows for 500ms after navigation starts. You can customize this in the hook:

```typescript
navigateWithLoader('/path', 'Loading...', 100); // Custom delay
```

## Best Practices

1. **Use Smart Navigation**: Prefer `useSmartNavigation` over `useNavigationLoader` for automatic message detection.

2. **Consistent Messages**: The automatic messages are designed to be consistent across the app. Only use custom messages when necessary.

3. **Error Handling**: Always handle errors when using manual loader control to ensure the spinner is hidden.

4. **Performance**: The spinner adds a small delay to navigation to ensure it's visible. This improves perceived performance by giving users feedback.

## Examples in Codebase

- **Login Page**: `src/app/login/page.tsx` - Shows role-based navigation with appropriate messages
- **Dashboard Header**: `src/components/dashboardHeader/index.tsx` - Logo click navigation
- **Dashboard Options**: `src/components/dashboardOptions/index.tsx` - Menu navigation

## Troubleshooting

### Spinner Not Showing
- Ensure `NavigationProvider` is properly wrapped around your app
- Check that you're using the navigation hooks instead of direct `router.push`

### Spinner Stuck
- Make sure to call `hideLoader()` in error cases when using manual control
- Check for JavaScript errors that might prevent navigation completion

### Custom Messages Not Working
- Verify you're passing the message as the second parameter
- Check that the message is a non-empty string