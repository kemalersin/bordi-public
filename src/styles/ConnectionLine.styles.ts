import styled from 'styled-components';

/**
 * SVG Konteyner Stili
 * 
 * - Fixed pozisyonlama ile tam ekran kaplama
 * - Tıklama olaylarını engelleme (pointer-events: none)
 * - z-index kontrolü
 */

/* ${props => props.zIndex || 1} */

export const ConnectionLineSvg = styled.svg<{ zIndex?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index:  ${props => props.zIndex || 1};
`;

/**
 * Çizgi Stili
 * 
 * - Dolgu yok (fill: none)
 * - Yumuşak kenarlar (stroke-linecap: round)
 * - Yumuşak köşeler (stroke-linejoin: round)
 * - Gölge efekti (drop-shadow)
 */
export const ConnectionPath = styled.path`
  fill: none;
  stroke: ${props => props.color || '#000'};
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
`; 