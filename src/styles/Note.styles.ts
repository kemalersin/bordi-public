import React from 'react';
import styled from 'styled-components';
import { NoteData } from '../types/Note.types';

/**
 * Note Bileşeni
 * Not kartı görünümü
 * 
 * Props:
 * @param isEditing - Düzenleme modu durumu
 * 
 * Özellikler:
 * - Minimum boyutlar
 * - Yarı saydam arkaplan
 * - Yumuşak köşeler
 * - Gölge efekti
 * - Hover animasyonları
 * - El yazısı fontu
 * - Metin seçim kontrolü
 */
export const Note = styled.div.attrs({
  className: 'note'
})<{ isEditing: boolean; note: NoteData }>`
  background: rgba(255, 192, 203, 0.9);
  border-radius: 2px;
  padding: 15px;
  padding-top: 10px;
  padding-right: 8px;
  position: relative;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.2));
  cursor: ${props => props.isEditing ? 'text' : 'default'};
  line-height: 1.4;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  will-change: transform;
  display: flex;
  flex-direction: column;
  min-width: 175px;
  user-select: ${props => props.isEditing ? 'text' : 'none'};
  -webkit-user-select: ${props => props.isEditing ? 'text' : 'none'};
  -moz-user-select: ${props => props.isEditing ? 'text' : 'none'};
  -ms-user-select: ${props => props.isEditing ? 'text' : 'none'};
  
  // Arkaplan rengine göre metin rengini ayarla
  ${props => {
    // RGBA değerlerini al
    const rgba = props.note.color.match(/[\d.]+/g);
    if (rgba && rgba.length >= 3) {
      const r = parseInt(rgba[0]);
      const g = parseInt(rgba[1]);
      const b = parseInt(rgba[2]);
      
      // Renk parlaklığını hesapla (YIQ formülü)
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      
      // Parlaklık 128'den küçükse beyaz, değilse siyah metin rengi kullan
      return `
        color: ${yiq < 128 ? '#fff' : '#000'};
        --link-color: ${yiq < 128 ? '#90CAF9' : '#2196F3'};
        --link-hover-color: ${yiq < 128 ? '#64B5F6' : '#1976D2'};
      `;
    }
    return '';
  }}
  
  &:hover {
    box-shadow: 0 8px 16px var(--hover-shadow-color, rgba(0,0,0,0.3));
  }

  ${props => props.note.isCompleted && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg preserveAspectRatio='none' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L100 100M100 0L0 100' stroke='${props.note.color.match(/[\d.]+/g) && ((parseInt(props.note.color.match(/[\d.]+/g)![0]) * 299 + parseInt(props.note.color.match(/[\d.]+/g)![1]) * 587 + parseInt(props.note.color.match(/[\d.]+/g)![2]) * 114) / 1000) < 128 ? 'white' : 'black'}' stroke-width='5' vector-effect='non-scaling-stroke' stroke-opacity='0.1'/%3E%3C/svg%3E");
      background-size: 100% 100%;
      pointer-events: none;
    }
  `}
`;

/**
 * NoteContent Bileşeni
 * Not içeriği konteyneri
 * 
 * Özellikler:
 * - Otomatik kelime kaydırma
 * - Özel scrollbar tasarımı
 * - Dikey taşma kontrolü
 */
export const NoteContent = styled.div`
  width: 100%;
  height: 100%;
  outline: none;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  overflow-y: auto;
  margin-bottom: 8px;
  font-family: 'Caveat', cursive;
  font-size: 1.2rem;
 
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

/**
 * Not tarihi için stil
 */
export const NoteDate = styled.div<{ style?: { fontFamily?: string }, isLocked?: boolean }>`
  position: absolute;
  bottom: 4px;
  right: 8px;
  font-size: ${props => {
    if (props.style?.fontFamily?.includes('Caveat')) return '15px';
    if (props.style?.fontFamily?.includes('monospace')) return '11px';
    return '12px';
  }} !important;
  color: currentColor;
  opacity: 0.5;
  font-style: italic;
  transform-origin: bottom right;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  
  /* Kilitli durum için kilit simgesi */
  ${props => props.isLocked && `
    &::before {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>') no-repeat center;
      background-size: contain;
      opacity: 0.7;
    }
  `}
`;

/**
 * Not menüsü düğmesi
 */
export const MenuButton = styled.button<{ isDragging: boolean; isHovering: boolean }>`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: var(--menu-button-bg, rgba(255, 255, 255, 0.9));
  color: var(--menu-button-color, #333);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.isHovering && !props.isDragging ? 1 : 0};
  transition: opacity 0.3s ease, transform 0.1s ease, background-color 0.2s ease;
  z-index: 10;

  svg {
    width: 16px;
    height: 16px;
    color: var(--menu-button-color, #333);
  }

  &:active {
    transform: scale(0.9);
    background: var(--menu-button-active-bg, rgba(240, 240, 240, 0.9));
  }

  &:hover {
    background: var(--menu-button-hover-bg, rgba(250, 250, 250, 0.9));
  }

  @media (prefers-color-scheme: dark) {
    --menu-button-bg: rgba(50, 50, 50, 0.9);
    --menu-button-color: #fff;
    --menu-button-active-bg: rgba(60, 60, 60, 0.9);
    --menu-button-hover-bg: rgba(70, 70, 70, 0.9);
  }
`;

/**
 * Menü overlay
 */
export const MenuOverlay = styled.div<{ isVisible: boolean; isDragging: boolean }>`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--overlay-bg, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15),
              0 2px 8px rgba(0, 0, 0, 0.08),
              0 0 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 4px;
  display: flex;
  gap: 4px;
  opacity: ${props => (props.isVisible && !props.isDragging) ? 1 : 0};
  pointer-events: ${props => (props.isVisible && !props.isDragging) ? 'auto' : 'none'};
  transition: all 0.3s ease;
  z-index: 11;

  // Not ile menü arasında görünmez bağlantı alanı
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 8px;
    background: transparent;
  }
  
  ${props => !props.isVisible && `
    transform: translateX(-50%) translateY(10px);
  `}

  @media (prefers-color-scheme: dark) {
    background: rgba(51, 51, 51, 0.8);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.2),
                0 0 1px rgba(0, 0, 0, 0.2);
  }
`;

/**
 * Menü öğesi
 */
export const MenuItem = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: var(--menu-item-bg, white);
  color: var(--menu-item-color, #333);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease, border 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media (prefers-color-scheme: dark) {
    --menu-item-bg: #444;
    --menu-item-color: #fff;
    --menu-item-active-bg: rgba(76, 175, 80, 0.3);
    --menu-item-active-color: rgba(76, 175, 80, 1);
    --menu-item-active-border: rgba(76, 175, 80, 0.4);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

/**
 * Renk seçici konteyneri
 */
export const ColorPicker = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  transform: none;
  margin-top: 8px;
  background: var(--overlay-bg, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15),
              0 2px 8px rgba(0, 0, 0, 0.08),
              0 0 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  z-index: 12;

  .custom-color-button {
    background: repeating-conic-gradient(
      rgba(255, 255, 255, 0.8) 0% 25%,
      rgba(0, 0, 0, 0.1) 0% 50%
    );
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 16px;
      height: 16px;
      color: rgba(0, 0, 0, 0.5);
      transition: transform 0.2s ease;
    }

    &:hover svg {
      transform: scale(1.1);
    }

    @media (prefers-color-scheme: dark) {
      background: repeating-conic-gradient(
        rgba(255, 255, 255, 0.2) 0% 25%,
        rgba(0, 0, 0, 0.3) 0% 50%
      );

      svg {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(51, 51, 51, 0.8);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.2),
                0 0 1px rgba(0, 0, 0, 0.2);

    .custom-color-button svg {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

/**
 * Renk seçeneği
 */
export const ColorOption = styled.button<{ color: string; isSelected: boolean }>`
  width: 24px;
  height: 24px;
  position: relative;
  border: 2px solid ${props => props.isSelected ? 'white' : 'transparent'};
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
  box-shadow: ${props => props.isSelected ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none'};

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }

  .custom-color-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {
    border-color: ${props => props.isSelected ? 'rgba(255,255,255,0.8)' : 'transparent'};
    box-shadow: ${props => props.isSelected ? '0 0 0 2px rgba(255,255,255,0.1)' : 'none'};
  }
`;

/**
 * Font seçici konteyneri
 */
export const FontPicker = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  transform: none;
  margin-top: 8px;
  background: var(--overlay-bg, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15),
              0 2px 8px rgba(0, 0, 0, 0.08),
              0 0 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 12;
  min-width: 120px;

  @media (prefers-color-scheme: dark) {
    background: rgba(51, 51, 51, 0.8);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.2),
                0 0 1px rgba(0, 0, 0, 0.2);
  }
`;

/**
 * Font seçeneği
 */
export const FontOption = styled.button<{ isSelected: boolean }>`
  width: 100%;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: ${props => props.isSelected ? 'var(--font-option-active-bg, rgba(0, 120, 255, 0.1))' : 'transparent'};
  color: var(--font-option-color, #333);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${props => props.style?.fontFamily?.includes('Caveat') ? '18px' : '14px'};

  &:hover {
    background: var(--font-option-hover-bg, rgba(0, 0, 0, 0.05));
  }

  &:active {
    background: var(--font-option-active-bg, rgba(0, 0, 0, 0.1));
  }

  @media (prefers-color-scheme: dark) {
    --font-option-color: #fff;
    --font-option-hover-bg: rgba(255, 255, 255, 0.1);
    --font-option-active-bg: rgba(0, 120, 255, 0.2);

    &:hover {
      background: var(--font-option-hover-bg);
    }

    &:active {
      background: var(--font-option-active-bg);
    }
  }
`; 