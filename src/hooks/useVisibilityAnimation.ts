import { useEffect } from 'react';

const useVisibilityAnimation = (
  areItemsVisible: boolean,
  setIsHiding: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (!areItemsVisible) {
      setIsHiding(false);
      const timer = setTimeout(() => {
        setIsHiding(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsHiding(false);
    }
  }, [areItemsVisible, setIsHiding]);
};

export default useVisibilityAnimation; 