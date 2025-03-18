import styled from 'styled-components';
import { DialogContent } from './VideoUrlDialog.styles';

export const BoardListDialogContent = styled(DialogContent)`
  min-width: 380px;
  max-width: 440px;
  padding: 0;
  border-radius: 16px;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border-color);
  overflow: hidden;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: var(--header-bg);
    border-bottom: 1px solid var(--border-color);

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: var(--heading-color);
      letter-spacing: -0.01em;
    }

    .close-button {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      color: var(--close-button-color);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 0;

      &:hover {
        background: var(--close-button-hover-bg);
        color: var(--close-button-hover-color);
        transform: rotate(90deg);
      }

      &:active {
        transform: rotate(90deg) scale(0.9);
      }

      svg {
        width: 20px;
        height: 20px;
        stroke-width: 2;
      }
    }
  }

  .search-container {
    padding: 20px 20px 12px;
    background: var(--header-bg);
    border-bottom: 1px solid var(--border-color);
    position: relative;
    pointer-events: none;

    .search-input {
      pointer-events: auto;
      width: 100%;
      height: 36px;
      padding: 0 12px 0 36px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: var(--input-bg);
      color: var(--text-color);
      font-size: 14px;
      letter-spacing: -0.01em;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      &:focus {
        outline: none;
        border-color: var(--accent-color);
        background: var(--input-focus-bg);
      }

      &::placeholder {
        color: var(--secondary-text);
      }
    }

    .search-icon {
      position: absolute;
      left: 32px;
      top: 29px;
      width: 16px;
      height: 16px;
      color: var(--secondary-text);
      pointer-events: none;
      stroke-width: 2;
    }
  }

  .board-list {
    max-height: 420px;
    overflow-y: auto;
    padding: 8px 0;
    background: var(--list-bg);

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--scroll-thumb);
      border-radius: 2px;

      &:hover {
        background: var(--scroll-thumb-hover);
      }
    }
  }

  .board-item {
    padding: 12px 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    margin: 0 8px;
    border-radius: 8px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%) scaleY(0);
      height: 24px;
      width: 3px;
      background: var(--accent-color);
      border-radius: 0 2px 2px 0;
      opacity: 0;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      background: var(--hover-bg);

      &::before {
        opacity: 0.5;
        transform: translateY(-50%) scaleY(1);
      }

      .board-content {
        transform: translateX(4px);
      }

      .board-actions .delete-button, 
      .board-actions .favorite-button {
        opacity: 1;
        transform: translateX(0);
      }
    }

    &.active {
      background: var(--active-bg);
      
      &::before {
        opacity: 1;
        transform: translateY(-50%) scaleY(1);
      }
      
      &:hover {
        background: var(--active-hover-bg);
      }
      
      .board-content {
        transform: translateX(4px);
      }

      .board-name {
        color: var(--active-text);
        font-weight: 500;
      }

      .board-date {
        color: var(--active-secondary-text);
      }
    }

    .board-content {
      flex: 1;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .board-name {
      font-size: 14px;
      margin-bottom: 4px;
      color: var(--text-color);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: -0.01em;
    }

    .board-date {
      font-size: 12px;
      color: var(--secondary-text);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: -0.01em;
    }

    .board-actions {
      display: flex;
      align-items: center;
    }

    .delete-button {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      color: var(--delete-button-color);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 0;
      opacity: 0;
      transform: translateX(8px);

      &.confirm {
        opacity: 1;
        transform: translateX(0);
      }

      &:hover {
        background: var(--delete-button-hover-bg);
        color: var(--delete-button-hover-color);
      }

      &:active {
        transform: scale(0.9);
      }

      svg {
        width: 18px;
        height: 18px;
        stroke-width: 2;
      }
    }

    .favorite-button {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      color: var(--secondary-text);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 0;
      opacity: 0;
      transform: translateX(8px);
      margin-right: 0;

      &.with-delete {
        margin-right: 4px;
      }

      &.active {
        color: #FFD700;
        opacity: 1;
        transform: translateX(0);

        svg {
          fill: #FFD700;
        }
      }

      &:hover {
        background: rgba(255, 215, 0, 0.1);
        color: #FFD700;
      }

      &:active {
        transform: scale(0.9);
      }

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;

    button {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid var(--button-border);
      background: var(--button-bg);
      color: var(--button-text);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: var(--button-hover-bg);
        border-color: var(--button-hover-border);
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }

  @media (prefers-color-scheme: dark) {
    --header-bg: rgba(0, 0, 0, 0.3);
    --heading-color: rgba(255, 255, 255, 0.95);
    --list-bg: rgba(0, 0, 0, 0.2);
    --border-color: rgba(255, 255, 255, 0.1);
    --scroll-thumb: rgba(255, 255, 255, 0.1);
    --scroll-thumb-hover: rgba(255, 255, 255, 0.2);
    --hover-bg: rgba(255, 255, 255, 0.05);
    --active-bg: rgba(255, 255, 255, 0.08);
    --active-hover-bg: rgba(255, 255, 255, 0.12);
    --text-color: rgba(255, 255, 255, 0.75);
    --hover-text: rgba(255, 255, 255, 0.95);
    --active-text: rgba(255, 255, 255, 1);
    --secondary-text: rgba(255, 255, 255, 0.45);
    --active-secondary-text: rgba(255, 255, 255, 0.6);
    --accent-color: #60a5fa;
    --close-button-color: rgba(255, 255, 255, 0.5);
    --close-button-hover-bg: rgba(255, 255, 255, 0.1);
    --close-button-hover-color: rgba(255, 255, 255, 0.95);
    --button-bg: rgba(255, 255, 255, 0.1);
    --button-border: rgba(255, 255, 255, 0.1);
    --button-text: #fff;
    --button-hover-bg: rgba(255, 255, 255, 0.15);
    --button-hover-border: rgba(255, 255, 255, 0.2);
    --delete-button-color: rgba(255, 255, 255, 0.4);
    --delete-button-hover-bg: rgba(239, 68, 68, 0.1);
    --delete-button-hover-color: rgb(239, 68, 68);
    --input-bg: rgba(0, 0, 0, 0.2);
    --input-focus-bg: rgba(0, 0, 0, 0.3);
  }

  @media (prefers-color-scheme: light) {
    --header-bg: rgba(255, 255, 255, 0.8);
    --heading-color: #111827;
    --list-bg: rgba(255, 255, 255, 0.7);
    --border-color: rgba(0, 0, 0, 0.08);
    --scroll-thumb: rgba(0, 0, 0, 0.1);
    --scroll-thumb-hover: rgba(0, 0, 0, 0.2);
    --hover-bg: rgba(0, 0, 0, 0.02);
    --active-bg: rgba(59, 130, 246, 0.08);
    --active-hover-bg: rgba(59, 130, 246, 0.12);
    --text-color: #4b5563;
    --hover-text: #111827;
    --active-text: #1e40af;
    --secondary-text: #9ca3af;
    --active-secondary-text: #6b7280;
    --accent-color: #3b82f6;
    --close-button-color: rgba(0, 0, 0, 0.4);
    --close-button-hover-bg: rgba(0, 0, 0, 0.05);
    --close-button-hover-color: rgba(0, 0, 0, 0.8);
    --button-bg: #fff;
    --button-border: #e5e7eb;
    --button-text: #374151;
    --button-hover-bg: #f9fafb;
    --button-hover-border: #d1d5db;
    --delete-button-color: rgba(0, 0, 0, 0.4);
    --delete-button-hover-bg: rgba(239, 68, 68, 0.1);
    --delete-button-hover-color: rgb(239, 68, 68);
    --input-bg: rgba(255, 255, 255, 0.8);
    --input-focus-bg: rgba(255, 255, 255, 0.95);
  }
`; 