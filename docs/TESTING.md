# Testing Guide for Frontend Application

This guide provides comprehensive information about testing in our frontend application using Vitest, React Testing Library, and MSW.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Testing Patterns](#testing-patterns)
- [Coverage Requirements](#coverage-requirements)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Testing Stack

### Core Testing Tools
- **Vitest**: Fast, Vite-native test runner
- **React Testing Library**: Testing utilities for React components
- **MSW (Mock Service Worker)**: API mocking for tests
- **User Event**: Utilities for simulating user interactions

### Additional Utilities
- **Jest DOM**: Custom DOM matchers
- **Test Utils**: Custom rendering helpers with providers

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests once and exit
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run tests silently (minimal output)
npm run test:silent
```

### Targeted Testing

```bash
# Test specific file types
npm run test:hooks        # Hook tests only
npm run test:components   # Component tests only
npm run test:services     # Service tests only

# Test specific categories
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only

# Test specific files
npx vitest src/hooks/useAdminPanel.test.ts
npx vitest src/components/Dashboard.test.tsx
```

### CI/CD Testing

```bash
# Run tests for CI (includes coverage and XML reports)
npm run test:ci
```

## Writing Tests

### Test File Organization

```
src/
├── components/
│   ├── Dashboard.tsx
│   └── __tests__/
│       └── Dashboard.test.tsx
├── hooks/
│   ├── useAdminPanel.ts
│   └── __tests__/
│       └── useAdminPanel.test.ts
├── services/
│   ├── solutionReviewApi.ts
│   └── __tests__/
│       └── solutionReviewApi.test.ts
└── test/
    ├── setup.ts           # Test configuration
    ├── utils.tsx          # Custom render utilities
    ├── test-utils.ts      # Testing helper functions
    └── mocks/
        ├── handlers.ts    # MSW handlers
        └── server.ts      # MSW server setup
```

### Test Naming Conventions

```typescript
// File naming
ComponentName.test.tsx    // For React components
hookName.test.ts         // For custom hooks
serviceName.test.ts      // For services/APIs

// Test structure
describe('ComponentName', () => {
  describe('feature or method', () => {
    it('should do something specific', () => {
      // Test implementation
    });
  });
});
```

## Testing Patterns

### Component Testing

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render with correct content', () => {
    render(<MyComponent title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  
  it('should handle user interactions', async () => {
    const onClickMock = vi.fn();
    render(<MyComponent onClick={onClickMock} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(onClickMock).toHaveBeenCalledOnce();
    });
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useMyHook());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
  });
  
  it('should handle async operations', async () => {
    const { result } = renderHook(() => useMyHook());
    
    await act(async () => {
      await result.current.fetchData();
    });
    
    expect(result.current.data).toBeDefined();
  });
});
```

### Service/API Testing

```typescript
import { vi } from 'vitest';
import axios from 'axios';
import { myApiFunction } from '../myApi';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('myApiFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should make correct API call', async () => {
    const mockResponse = { data: { success: true } };
    mockedAxios.get.mockResolvedValue(mockResponse);
    
    const result = await myApiFunction('test-id');
    
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/test/test-id');
    expect(result).toEqual(mockResponse.data);
  });
});
```

### MSW Integration

MSW is set up to intercept API calls during tests. Handlers are defined in `src/test/mocks/handlers.ts`:

```typescript
// Using default handlers
test('should fetch data successfully', async () => {
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});

// Overriding handlers for specific tests
test('should handle API errors', async () => {
  server.use(
    http.get('/api/data', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );
  
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });
});
```

## Coverage Requirements

### Global Thresholds
- **Branches**: 85%
- **Functions**: 85%
- **Lines**: 85%
- **Statements**: 85%

### Per-Directory Thresholds
- **Hooks** (`src/hooks/`): 90%
- **Services** (`src/services/`): 95%

### Viewing Coverage

```bash
# Generate and view coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/index.html
```

## Best Practices

### 1. Test Structure
- Use descriptive test names
- Group related tests in `describe` blocks
- Follow Arrange-Act-Assert pattern

### 2. Component Testing
- Test user behavior, not implementation details
- Use accessible queries (getByRole, getByLabelText, etc.)
- Test component states and edge cases

### 3. Hook Testing
- Test initial state and state changes
- Test error conditions
- Use `act()` for state updates

### 4. API Testing
- Mock external dependencies
- Test both success and error scenarios
- Verify correct API calls are made

### 5. Accessibility Testing
- Use semantic queries
- Test keyboard navigation
- Verify ARIA attributes

### 6. Performance
- Keep tests focused and fast
- Use `waitFor` for async operations
- Avoid unnecessary complexity

## Test Utilities

### Custom Render Function
```typescript
import { render } from '../test/utils';

// Automatically includes providers
render(<MyComponent />);

// Without router (for isolated testing)
renderWithoutRouter(<MyComponent />);
```

### Test Helpers
```typescript
import { 
  mockConsole,
  mockLocalStorage,
  createMockFile,
  flushPromises 
} from '../test/test-utils';

// Mock browser APIs
mockLocalStorage();
mockConsole();

// Create test files
const file = createMockFile('test.txt', 'content');

// Wait for async operations
await flushPromises();
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in test configuration
   - Use `waitFor` for async operations
   - Check for unresolved promises

2. **Mock not working**
   - Ensure mocks are cleared between tests
   - Check mock setup order
   - Verify mock import paths

3. **Coverage not accurate**
   - Check coverage excludes in config
   - Ensure all source files are included
   - Run coverage with `--all` flag

4. **Component not rendering**
   - Check provider setup in test utils
   - Verify component props
   - Check for missing context

### Debug Mode

```bash
# Run single test with verbose output
npx vitest --run --reporter=verbose MyComponent.test.tsx

# Debug specific test
npx vitest --run --reporter=verbose --testNamePattern="specific test name"
```

### Environment Variables

```bash
# Enable debug mode
DEBUG=true npm test

# Skip slow tests
SKIP_SLOW_TESTS=true npm test

# CI mode
CI=true npm run test:ci
```

## CI/CD Integration

The test configuration includes CI-specific settings:
- JUnit XML reporting for test results
- LCOV coverage format for external tools
- Non-interactive mode
- Appropriate timeouts

Example GitHub Actions workflow:
```yaml
- name: Run tests
  run: npm run test:ci
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## Adding New Tests

1. **Create test file** in appropriate `__tests__` directory
2. **Import testing utilities** and component/hook to test
3. **Write test cases** following established patterns
4. **Run tests** to ensure they pass
5. **Check coverage** to ensure adequate coverage
6. **Update this guide** if introducing new patterns

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)