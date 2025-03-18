/**
 * ImageModal.tsx
 * Tam Boyutlu Fotoğraf Modal Bileşeni
 * 
 * Özellikler:
 * 1. Fotoğrafı orijinal boyutunda gösterme
 * 2. Çarpı ile kapatma
 * 3. ESC tuşu ile kapatma
 * 4. Animasyonlu geçişler
 */

import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { ImageModalProps } from '../types/ImageModal.types';
import { ImageDialogContent, CloseButton, ModalImage, StyledDialogArea } from '../styles/ImageModal.styles';

export const ImageModal: React.FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <StyledDialogArea 
      className={`image-modal ${isClosing ? '' : 'visible'}`}
      onClick={handleClose}
    >
      <ImageDialogContent 
        className={isClosing ? '' : 'visible'}
        onClick={e => e.stopPropagation()}
      >
        <CloseButton onClick={handleClose}>
          <MdClose />
        </CloseButton>
        <ModalImage
          src={src}
          alt=""
        />
      </ImageDialogContent>
    </StyledDialogArea>
  );
}; 