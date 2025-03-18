/**
 * Renk Sabitleri
 * 
 * Bu dosya, uygulama genelinde kullanılan renk paletlerini tanımlar.
 * Tüm renkler RGBA formatında ve yarı saydam olarak tanımlanmıştır.
 */

/**
 * Not Renkleri
 * 
 * Notlar için kullanılan canlı tonlar:
 * - Mercan: Enerjik ve sıcak
 * - Altın: Parlak ve lüks
 * - Turkuaz: Ferah ve dinamik
 * - Lime: Canlı ve taze
 * - Fuşya: Çarpıcı ve modern
 * 
 * Opaklık: 0.85 (hafif saydam)
 */
export const NOTE_COLORS = [
  'rgba(255, 111, 97, .95)',    // mercan
  'rgba(255, 197, 88, .95)',    // altın
  'rgba(77, 196, 205, .95)',    // turkuaz
  'rgba(163, 217, 98, .95)',    // lime
  'rgba(255, 120, 162, .95)',   // fuşya
];

/**
 * İp Renkleri
 * 
 * Bağlantı ipleri için kullanılan canlı renkler:
 * - Kırmızı: Dikkat çekici bağlantılar
 * - Yeşil: Pozitif ilişkiler
 * - Mavi: Profesyonel bağlantılar
 * - Sarı: Vurgulu ilişkiler
 * - Mor: Yaratıcı bağlantılar
 * - Turkuaz: Dengeli ilişkiler
 * 
 * Opaklık: 0.4 (belirgin saydam)
 */
export const ROPE_COLORS = [
  'rgba(255, 68, 68, .95)',    // kırmızı
  'rgba(68, 255, 68, .95)',    // yeşil
  'rgba(68, 68, 255, .95)',    // mavi
  'rgba(255, 255, 68, .95)',   // sarı
  'rgba(255, 68, 255, .95)',   // mor
  'rgba(68, 255, 255, .95)',   // turkuaz
];
