import styled from 'styled-components';
import { DialogArea } from './VideoUrlDialog.styles';

export const ImageDialogContent = styled.div`
  position: relative;
  background: var(--modal-bg, rgba(255, 255, 255, 0.95));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 0;
  overflow: hidden;
  will-change: transform, opacity;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &.visible {
    opacity: 1;
    transform: scale(1);
  }

  @media (prefers-color-scheme: dark) {
    --modal-bg: rgba(28, 28, 28, 0.95);
    --close-button-bg: rgba(255, 255, 255, 0.15);
    --close-button-hover: rgba(255, 255, 255, 0.25);
    --close-button-color: rgba(255, 255, 255, 0.9);
  }

  @media (prefers-color-scheme: light) {
    --modal-bg: rgba(255, 255, 255, 0.95);
    --close-button-bg: rgba(0, 0, 0, 0.15);
    --close-button-hover: rgba(0, 0, 0, 0.25);
    --close-button-color: rgba(0, 0, 0, 0.9);
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--close-button-border, rgba(255, 255, 255, 0.2));
  background: var(--close-button-bg, rgba(0, 0, 0, 0.6));
  color: var(--close-button-color, rgba(255, 255, 255, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  z-index: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15),
              0 1px 2px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  &:hover {
    background: var(--close-button-hover, rgba(0, 0, 0, 0.8));
    border-color: var(--close-button-border-hover, rgba(255, 255, 255, 0.4));
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2),
                0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.95) rotate(90deg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
  }

  @media (prefers-color-scheme: dark) {
    --close-button-bg: rgba(0, 0, 0, 0.8);
    --close-button-hover: rgba(0, 0, 0, 0.95);
    --close-button-color: rgba(255, 255, 255, 0.95);
    --close-button-border: rgba(255, 255, 255, 0.25);
    --close-button-border-hover: rgba(255, 255, 255, 0.5);
  }

  @media (prefers-color-scheme: light) {
    --close-button-bg: rgba(0, 0, 0, 0.6);
    --close-button-hover: rgba(0, 0, 0, 0.8);
    --close-button-color: rgba(255, 255, 255, 0.9);
    --close-button-border: rgba(255, 255, 255, 0.2);
    --close-button-border-hover: rgba(255, 255, 255, 0.4);
  }
`;

export const ModalImage = styled.img.attrs({
  className: 'modal-image'
})`
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
`;

export const StyledDialogArea = styled(DialogArea)`
  background: var(--overlay-bg, rgba(0, 0, 0, 0.75));
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }

  @media (prefers-color-scheme: dark) {
    --overlay-bg: rgba(0, 0, 0, 0.85);
  }

  @media (prefers-color-scheme: light) {
    --overlay-bg: rgba(0, 0, 0, 0.75);
  }
`; 