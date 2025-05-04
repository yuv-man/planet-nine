import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// Add custom matchers
declare global {
  namespace jest {
    interface Matchers<R> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}

// Add Mock type
declare global {
  namespace jest {
    type Mock<T = any> = jest.Mock<T>;
  }
} 