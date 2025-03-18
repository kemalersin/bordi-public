import styled from 'styled-components';

export const DisplayListContainer = styled.div<{ isClosing: boolean }>`
  position: absolute;
  cursor: default !important;
  bottom: calc(100% + 16px);
  right: -9px;
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

export const DisplayItem = styled.div<{ isActive: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isActive ? 'var(--active-color, #0078ff)' : 'var(--text-color, #333)'};
  background: ${props => props.isActive ? 'rgba(0, 120, 255, 0.1)' : 'transparent'};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease-in-out;
  transform: scale(1);

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.15s ease-in;
  }

  &:active {
    background: rgba(255, 255, 255, 0.65);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    transform: scale(0.95);
    transition: all 0.1s ease-in;
  }

  &:not(:hover) {
    transition: all 0.3s ease-out;
  }

  @media (prefers-color-scheme: dark) {
    color: ${props => props.isActive ? '#0078ff' : '#fff'};

    &:hover {
      background: rgba(255, 255, 255, 0.35);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    &:active {
      background: rgba(255, 255, 255, 0.45);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }
  }
`;

export const DisplayNumber = styled.span<{ isActive: boolean }>`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${props => props.isActive ? '#ff3b30' : '#666666'};
  color: #ffffff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  z-index: 1;
  box-shadow: ${props => props.isActive ? '0 2px 4px rgba(255, 59, 48, 0.3)' : 'none'};
  border: ${props => props.isActive ? '1px solid rgba(255, 255, 255, 0.4)' : 'none'};

  @media (prefers-color-scheme: dark) {
    background: ${props => props.isActive ? '#ff453a' : '#888888'};
    color: #ffffff;
    box-shadow: ${props => props.isActive ? '0 2px 4px rgba(255, 69, 58, 0.5)' : 'none'};
    border: ${props => props.isActive ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'};
  }
`; 