import { useCallback } from 'react';

const useZIndex = (
  maxZIndex: number,
  setMaxZIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const increaseZIndex = useCallback((amount: number = 1) => {
    setMaxZIndex(prev => prev + amount);
  }, [setMaxZIndex]);

  const setNewZIndex = useCallback((newValue: number) => {
    setMaxZIndex(newValue);
  }, [setMaxZIndex]);

  return {
    increaseZIndex,
    setNewZIndex
  };
};

export default useZIndex; 