import { useCallback } from 'react';

const useHover = (
  hoveredItem: { id: number; type: 'note' | 'media' } | null,
  setHoveredItem: React.Dispatch<React.SetStateAction<{ id: number; type: 'note' | 'media' } | null>>
) => {
  const handleMouseEnter = useCallback((id: number, type: 'note' | 'media') => {
    setHoveredItem({ id, type });
  }, [setHoveredItem]);

  const handleMouseLeave = useCallback(() => {
    // Fare pozisyonunu takip et ve belirli bir mesafe uzaklaşana kadar hover durumunu koru
    const checkDistance = (e: MouseEvent) => {
      if (!hoveredItem) return;

      const element = document.querySelector(`[data-id="${hoveredItem.type}-${hoveredItem.id}"]`);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Fare ile nesne merkezi arasındaki mesafeyi hesapla
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) +
        Math.pow(e.clientY - centerY, 2)
      );

      // Mesafe 150 pikselden fazlaysa hover durumunu kaldır
      if (distance > 150) {
        setHoveredItem(null);
        document.removeEventListener('mousemove', checkDistance);
      }
    };

    document.addEventListener('mousemove', checkDistance);
  }, [hoveredItem, setHoveredItem]);

  return { handleMouseEnter, handleMouseLeave };
};

export default useHover; 