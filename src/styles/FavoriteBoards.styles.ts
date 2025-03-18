import styled from 'styled-components';

export const FavoriteBoardsArea = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999; 
  pointer-events: ${props => props.isVisible ? 'all' : 'none'};
`;

export const FavoriteBoardsContainer = styled.div<{ isVisible: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 8px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(-10px)'};
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

export const FavoriteBoardButton = styled.button<{ isActive: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isActive ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isActive ? '#000' : '#fff'};
  border: 1px solid ${props => props.isActive ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &[data-tooltip] {
    &:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% - 2px);
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      animation: showTooltip 0.3s ease forwards;
      animation-delay: 0.5s;
      pointer-events: none;
    }
  }

  @keyframes showTooltip {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
  &:hover {
    transform: scale(1.1);
    background: ${props => props.isActive ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  &:active {
    transform: scale(0.95);
  }

  @media (prefers-color-scheme: dark) {
    &[data-tooltip] {
      &:hover::after {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
      }
    }
  }
`; 