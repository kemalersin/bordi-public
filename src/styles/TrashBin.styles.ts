import styled from 'styled-components';

/**
 * Çöp Kutusu Konteyner Stili
 * 
 * Özellikler:
 * - Sabit konumlandırma (sağ alt köşe)
 * - Boyut: 150x150px
 * - Merkezi hizalama (flex)
 * - Yumuşak geçişler (all 0.2s ease)
 * - Duruma bağlı görünürlük ve etkileşim:
 *   1. Görünmez durumda: opacity 0, pointer-events none, scale 0.8
 *   2. Görünür durumda: opacity 1, pointer-events auto, scale 1
 *   3. Sürükleme üzerinde: scale 1.1
 */
export const TrashContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  right: 100px;
  bottom: 50px;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: default;
  z-index: 9000;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  transform: scale(${props => props.isVisible ? (props.className?.includes('drag-over') ? 1.1 : 1) : 0.8});

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.2s ease;
    transform: scale(${props => props.className?.includes('drag-over') ? 1.2 : 1});
  }

  &:hover img {
    transform: scale(1.1);
  }
`; 