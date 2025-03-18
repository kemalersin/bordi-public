import React from 'react';
import { FaDesktop } from 'react-icons/fa';
import { DisplayListProps } from '../types/ActionBar.types';
import { DisplayListContainer, DisplayItem, DisplayNumber } from '../styles/DisplayList.styles';
import { useTranslations } from '../hooks/useTranslations';

export const DisplayList: React.FC<DisplayListProps> = ({ 
  displays, 
  onDisplaySelect,
  onMouseEnter,
  onMouseLeave,
  isClosing = false
}) => {
  const translations = useTranslations();

  return (
    <DisplayListContainer
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      isClosing={isClosing}
      aria-label={translations.actionBar.displays}
      className="display-list"
    >
      {displays.map((display, index) => (
        <DisplayItem
          key={display.id}
          isActive={display.isActive}
          onClick={() => onDisplaySelect?.(display.id)}
          aria-label={`${translations.actionBar.screen} ${index + 1}${display.isPrimary ? ` (${translations.actionBar.primary})` : ''}`}
        >
          <FaDesktop />
          <DisplayNumber isActive={display.isActive}>
            {index + 1}
          </DisplayNumber>
        </DisplayItem>
      ))}
    </DisplayListContainer>
  );
}; 