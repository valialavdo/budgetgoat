import { useSafeAsyncStorage } from '../hooks/useSafeAsyncStorage';

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

describe('useSafeAsyncStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return default value when AsyncStorage fails', async () => {
    mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
    
    const { result } = renderHook(() => useSafeAsyncStorage('test-key', 'default-value'));
    
    expect(result.current.value).toBe('default-value');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('should load value from AsyncStorage successfully', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('stored-value');
    
    const { result } = renderHook(() => useSafeAsyncStorage('test-key', 'default-value'));
    
    await waitFor(() => {
      expect(result.current.value).toBe('stored-value');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should save value to AsyncStorage', async () => {
    const { result } = renderHook(() => useSafeAsyncStorage('test-key', 'default-value'));
    
    await act(async () => {
      await result.current.setValue('new-value');
    });
    
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'new-value');
  });
});
