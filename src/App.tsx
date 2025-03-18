/**
 * App.tsx
 * Bordi Uygulamasının Ana Bileşeni
 * 
 * Bu uygulama şu temel özelliklere sahiptir:
 * 1. Tam ekran şeffaf pano
 * 2. Not ve fotoğraf ekleme/düzenleme/silme
 * 3. Raptiye (pin) ve ip (rope) sistemi
 * 4. Fizik tabanlı ip animasyonları
 * 5. Sürükle-bırak etkileşimleri
 * 6. Masaüstü geçirgenliği
 * 
 * Temel Bileşenler:
 * - TiltedContainer: Döndürülebilir nesne konteyneri
 * - AnimatedClickableArea: Etkileşimli alan yönetimi
 * - Note: Not bileşeni
 * - MediaFrame: Fotoğraf bileşeni
 * - Pin: Raptiye bileşeni
 * - ConnectionLine: İp bileşeni
 * - TrashBin: Çöp kutusu
 * - ActionBar: Eylem çubuğu
 * 
 * Fizik Sistemi:
 * - Özel ip fizik hesaplamaları
 * - Yerçekimi ve yay sistemleri
 */

import React from 'react';
import { useAppState } from './hooks/useAppState';
import { useAppHooks } from './hooks/useAppHooks';
import { useAppEffects } from './hooks/useAppEffects';
import { AppRender } from './components/AppRender';
import './types/App.types'; // Global tip tanımlamaları için import

function App() {
  // State yönetimi
  const state = useAppState();
  
  // Hook'lar
  const hooks = useAppHooks(state);
  
  // Efektler
  useAppEffects(state, hooks);
  
  // Render
  return <AppRender state={state} hooks={hooks} />;
}

export default App;
