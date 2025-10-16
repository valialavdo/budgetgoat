import React from 'react';
import { render } from '@testing-library/react-native';
import { AppErrorBoundary } from '../components/AppErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('AppErrorBoundary', () => {
  it('renders children when there is no error', () => {
    const { getByText } = render(
      <AppErrorBoundary>
        <ThrowError shouldThrow={false} />
      </AppErrorBoundary>
    );
    
    expect(getByText('No error')).toBeTruthy();
  });

  it('renders error fallback when there is an error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { getByText } = render(
      <AppErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AppErrorBoundary>
    );
    
    expect(getByText('Oops! Something went wrong')).toBeTruthy();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <AppErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </AppErrorBoundary>
    );
    
    expect(onError).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
