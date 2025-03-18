import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

/**
 * Video URL Dialog Alan Stili
 * 
 * Özellikler:
 * - Yarı saydam siyah arka plan
 * - Bulanıklık efekti
 * - Board'u tamamen kaplar
 * - Fade-in animasyonu
 */
export const DialogArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay-bg, rgba(0, 0, 0, 0.3));
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100001;
  pointer-events: all;
  animation: ${fadeIn} 0.2s ease-out;
`;

/**
 * Video URL Dialog İçerik Stili
 * 
 * Özellikler:
 * - Buzlu cam efekti
 * - Yumuşak geçişler
 * - Karanlık tema desteği
 * - Slide-in animasyonu
 */
export const DialogContent = styled.div`
  position: relative;
  background: var(--dialog-bg, rgba(255, 255, 255, 0.8));
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: var(--dialog-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;

  h2 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: var(--text-color, #333);
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 14px;
    background: var(--input-bg, rgba(255, 255, 255, 0.9));
    color: var(--text-color, #333);

    &:focus {
      outline: none;
      border-color: var(--focus-color, rgba(255, 255, 255, 0.5));
      background: var(--input-focus-bg, white);
    }
  }

  .supported-sites {
    font-size: 12px;
    color: var(--secondary-text, #666);
    margin-bottom: 20px;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      background: var(--button-bg, rgba(255, 255, 255, 0.8));
      color: var(--button-text, #333);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      transition: all 0.2s ease;
      transform: scale(1);

        &:disabled {
          background: var(--disabled-bg, rgba(204, 204, 204, 0.8));
          cursor: not-allowed;
        }

      &:hover:not(:disabled) {
        background: var(--button-hover-bg, rgba(255, 255, 255, 0.9));
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
        transition-duration: 0.1s;
      }

      &.primary {
        background: var(--primary-button-bg, rgba(33, 150, 243, 0.9));
        color: var(--primary-button-text, white);

        &:hover {
          background: var(--primary-button-hover-bg, rgba(25, 118, 210, 0.95));
        }

        &:active:not(:disabled) {
          transform: scale(0.95);
          transition-duration: 0.1s;
        }
      }
    }
  }

  @media (prefers-color-scheme: dark) {
    --dialog-bg: rgba(51, 51, 51, 0.8);
    --dialog-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    --text-color: #fff;
    --border-color: rgba(255, 255, 255, 0.1);
    --input-bg: rgba(68, 68, 68, 0.9);
    --input-focus-bg: rgba(68, 68, 68, 1);
    --focus-color: rgba(255, 255, 255, 0.3);
    --secondary-text: rgba(170, 170, 170, 0.8);
    --button-bg: rgba(68, 68, 68, 0.8);
    --button-text: #fff;
    --button-hover-bg: rgba(85, 85, 85, 0.9);
    --primary-button-bg: rgba(25, 118, 210, 0.9);
    --primary-button-hover-bg: rgba(21, 101, 192, 0.95);
    --primary-button-text: #fff;
    --disabled-bg: rgba(102, 102, 102, 0.8);
  }
`; 