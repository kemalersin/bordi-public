import styled from 'styled-components';

export const BackgroundListContainer = styled.div<{ isClosing: boolean }>`
  position: absolute;
  cursor: default !important;
  bottom: calc(100% + 16px);
  right: -56px;
  background: var(--bar-bg, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 15px;
  padding: 8px;
  display: flex;
  gap: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15),
              0 2px 8px rgba(0, 0, 0, 0.08),
              0 0 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.35);
  pointer-events: all;
  opacity: ${props => props.isClosing ? 0 : 1};
  transform: translateY(${props => props.isClosing ? '8px' : '0'}) scale(${props => props.isClosing ? 0.97 : 1});
  transition: opacity 0.3s ease-in-out,
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;

  @media (prefers-color-scheme: dark) {
    background: rgba(51, 51, 51, 0.8);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.2),
                0 0 1px rgba(0, 0, 0, 0.2);
  }
`;

export const BackgroundItem = styled.button<{ isSelected?: boolean; background?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${props => props.isSelected ? 'var(--active-color, #0078ff)' : 'rgba(255, 255, 255, 0.35)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform: scale(${props => props.isSelected ? '1.1' : '1'});
  box-shadow: ${props => props.isSelected 
    ? '0 4px 12px rgba(0, 120, 255, 0.3), 0 0 0 2px rgba(0, 120, 255, 0.2)'
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  padding: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    pointer-events: none;
    background: ${props => props.background || 'none'};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 0.3s ease-in-out;
  }

  svg {
    width: 16px;
    height: 16px;
    color: rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: scale(${props => props.isSelected ? '1.15' : '1.1'});
    box-shadow: ${props => props.isSelected
      ? '0 6px 16px rgba(0, 120, 255, 0.4), 0 0 0 2px rgba(0, 120, 255, 0.3)'
      : '0 4px 8px rgba(0, 0, 0, 0.2)'};

    &::before {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: scale(0.95);

    &::before {
      transform: scale(0.95);
    }
  }

  @media (prefers-color-scheme: dark) {
    border-color: ${props => props.isSelected ? 'var(--active-color, #0078ff)' : 'rgba(255, 255, 255, 0.15)'};
    box-shadow: ${props => props.isSelected
      ? '0 4px 12px rgba(0, 120, 255, 0.4), 0 0 0 2px rgba(0, 120, 255, 0.3)'
      : '0 2px 4px rgba(0, 0, 0, 0.2)'};

    svg {
      color: rgba(255, 255, 255, 0.5);
    }

    &:hover {
      box-shadow: ${props => props.isSelected
        ? '0 6px 16px rgba(0, 120, 255, 0.5), 0 0 0 2px rgba(0, 120, 255, 0.4)'
        : '0 4px 8px rgba(0, 0, 0, 0.4)'};
    }
  }
`; 