import React from 'react';
import { FaImage } from 'react-icons/fa';
import { BackgroundListContainer, BackgroundItem } from '../styles/BackgroundList.styles';
import background1 from '../assets/background-1.jpg';
import backgroundIcon1 from '../assets/background-icon-1.jpg';
import { BACKGROUND_TYPES, BACKGROUND_COLORS } from '../constants/backgrounds';

interface BackgroundListProps {
  onBackgroundSelect: (type: 'transparent' | 'color' | 'image', value?: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isClosing: boolean;
  currentBackground: {
    type: 'transparent' | 'color' | 'image';
    value?: string;
  };
}

export const BackgroundList: React.FC<BackgroundListProps> = ({
  onBackgroundSelect,
  onMouseEnter,
  onMouseLeave,
  isClosing,
  currentBackground
}) => {
  return (
    <BackgroundListContainer
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      isClosing={isClosing}
      className="background-list"
    >
      <BackgroundItem
        onClick={() => onBackgroundSelect(BACKGROUND_TYPES.TRANSPARENT)}
        style={{ background: BACKGROUND_COLORS.TRANSPARENT_PATTERN }}
        isSelected={currentBackground.type === BACKGROUND_TYPES.TRANSPARENT}
      />
      <BackgroundItem
        onClick={() => onBackgroundSelect(BACKGROUND_TYPES.COLOR, BACKGROUND_COLORS.BLACK)}
        style={{ background: '#000' }}
        isSelected={currentBackground.type === BACKGROUND_TYPES.COLOR && currentBackground.value === BACKGROUND_COLORS.BLACK}
      />
      <BackgroundItem
        onClick={() => onBackgroundSelect(BACKGROUND_TYPES.COLOR, BACKGROUND_COLORS.GRAY)}
        style={{ background: '#808080' }}
        isSelected={currentBackground.type === BACKGROUND_TYPES.COLOR && currentBackground.value === BACKGROUND_COLORS.GRAY}
      />
      <BackgroundItem
        onClick={() => onBackgroundSelect(BACKGROUND_TYPES.COLOR, BACKGROUND_COLORS.WHITE)}
        style={{ background: BACKGROUND_COLORS.WHITE }}
        isSelected={currentBackground.type === BACKGROUND_TYPES.COLOR && currentBackground.value === BACKGROUND_COLORS.WHITE}
      />
      <BackgroundItem
        onClick={() => onBackgroundSelect(BACKGROUND_TYPES.COLOR, BACKGROUND_COLORS.WHEAT)}
        style={{ background: BACKGROUND_COLORS.WHEAT }}
        isSelected={currentBackground.type === BACKGROUND_TYPES.COLOR && currentBackground.value === BACKGROUND_COLORS.WHEAT}
      />
      <BackgroundItem
        onClick={() => onBackgroundSelect(BACKGROUND_TYPES.IMAGE, background1)}
        background={`url(${backgroundIcon1})`}
        isSelected={currentBackground.type === BACKGROUND_TYPES.IMAGE && currentBackground.value === background1}
      />
    </BackgroundListContainer>
  );
}; 