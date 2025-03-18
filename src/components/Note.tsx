/**
 * Note.tsx
 * Not Bileşeni
 * 
 * Özellikler:
 * 1. Sürükle-bırak
 * 2. Boyutlandırma
 * 3. İçerik düzenleme
 * 4. Yazı boyutu kontrolü
 * 5. Tarih gösterimi
 * 6. Pin ekleme desteği
 */

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { MdTextDecrease, MdTextIncrease, MdMoreVert, MdOutlineColorLens, MdDone, MdColorize, MdFormatSize, MdLock, MdLockOpen } from 'react-icons/md';

import { NoteProps } from '../types/Note.types';
import { Note as StyledNote, NoteContent, NoteDate, MenuButton, MenuOverlay, MenuItem, ColorPicker, ColorOption, FontPicker, FontOption } from '../styles/Note.styles';
import { NOTE_DEFAULT_HEIGHT } from '../constants/sizes';
import { NOTE_DEFAULT_WIDTH } from '../constants/sizes';
import { NOTE_COLORS } from '../constants/colors';
import { getFontList } from '../constants/fonts';
import { getIpcRendererOrMock } from '../utils/electron';

// URL regex pattern'i
const URL_REGEX = /((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?)/g;

// Link dönüştürme fonksiyonu
const convertLinksToAnchors = (text: string) => {
  // Önce satır sonlarını geçici bir işaretleyici ile değiştir
  const tempText = text.replace(/\n/g, '{{NEWLINE}}');
  
  // Linkleri dönüştür
  const textWithLinks = tempText.replace(URL_REGEX, (match, url, offset, str) => {
    const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
    const fullUrl = hasProtocol ? url : `https://${url}`;
    return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--link-color, #2196F3); text-decoration: none; transition: color 0.2s ease;" onmouseover="this.style.color='var(--link-hover-color, #1976D2)'" onmouseout="this.style.color='var(--link-color, #2196F3)'" data-url="${fullUrl}">${url.trim()}</a>`;
  });
  
  // Satır sonlarını geri getir ve HTML satır sonlarına dönüştür
  return textWithLinks
    .replace(/{{NEWLINE}}/g, '<br>')
    .replace(/(<br>)\1+/g, '$1$1') // İkiden fazla satır sonunu iki satır sonuna indir
    .replace(/^<br>|(<br>)$/g, ''); // Sadece baştaki ve tek sondaki satır sonunu temizle
};

interface Font {
  id: string;
  name: string;
  family: string;
}

export const Note: React.FC<NoteProps> = ({
  note,
  isEditing,
  onDoubleClick,
  onContentChange,
  onFontSizeChange,
  onColorChange,
  onToggleComplete,
  onFontChange,
  onToggleLock,
  children,
  isDragging
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [shouldShowMenu, setShouldShowMenu] = useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [isFontPickerVisible, setIsFontPickerVisible] = useState(false);
  const [customColor, setCustomColor] = useState(() => {
    // HEX'e çevir
    const rgba = note.color.match(/[\d.]+/g);
    if (rgba && rgba.length >= 3) {
      const r = parseInt(rgba[0]).toString(16).padStart(2, '0');
      const g = parseInt(rgba[1]).toString(16).padStart(2, '0');
      const b = parseInt(rgba[2]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return '#000000';
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout>();
  const fonts = getFontList();

  // İmleç konumlandırma effect'i
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      
      // İmleci sona konumlandır
      const range = document.createRange();
      const selection = window.getSelection();
      
      range.selectNodeContents(contentRef.current);
      range.collapse(false); // false = sona konumlandır
      
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  // Fare pozisyonunu takip et
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Fare uzaklığını kontrol et ve menüyü yönet
  useEffect(() => {
    if (!isMenuVisible || !noteRef.current) return;

    const rect = noteRef.current.getBoundingClientRect();
    const menuRect = noteRef.current.querySelector('.note-menu')?.getBoundingClientRect();

    if (!menuRect) return;

    // Not alanını genişlet
    const expandedNoteArea = {
      left: rect.left - 50,
      right: rect.right + 50,
      top: rect.top - 50,
      bottom: rect.bottom + 50
    };

    // Menü alanını genişlet
    const expandedMenuArea = {
      left: menuRect.left - 100,
      right: menuRect.right + 100,
      top: menuRect.top - 100,
      bottom: menuRect.bottom + 100
    };

    // Fare pozisyonunun genişletilmiş alanlarda olup olmadığını kontrol et
    const isMouseInExpandedArea = 
      (mousePosition.x >= expandedNoteArea.left && mousePosition.x <= expandedNoteArea.right &&
       mousePosition.y >= expandedNoteArea.top && mousePosition.y <= expandedNoteArea.bottom) ||
      (mousePosition.x >= expandedMenuArea.left && mousePosition.x <= expandedMenuArea.right &&
       mousePosition.y >= expandedMenuArea.top && mousePosition.y <= expandedMenuArea.bottom);

    // Fare genişletilmiş alanların dışındaysa menüyü kapat
    if (!isMouseInExpandedArea) {
      setTimeout(() => {
        setIsMenuVisible(false);
        setIsColorPickerVisible(false);
        setIsFontPickerVisible(false);
      }, 300);
    }
  }, [mousePosition, isMenuVisible]);

  // isHovering ve isDragging değişimlerini yönet
  useEffect(() => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }

    if (isHovering && !isDragging) {
      menuTimeoutRef.current = setTimeout(() => {
        if (isHovering && !isDragging) {
          setShouldShowMenu(true);
        }
      }, 300);
    } else {
      menuTimeoutRef.current = setTimeout(() => {
        setShouldShowMenu(false);
      }, 300);
    }

    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, [isHovering, isDragging]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleIncreaseFontSize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsColorPickerVisible(false);
    setIsFontPickerVisible(false);
    if (onFontSizeChange) {
      onFontSizeChange(note.fontSize + 0.1);
    }
  }, [note.fontSize, onFontSizeChange]);

  const handleDecreaseFontSize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsColorPickerVisible(false);
    setIsFontPickerVisible(false);
    if (onFontSizeChange && note.fontSize > 0.8) {
      onFontSizeChange(note.fontSize - 0.1);
    }
  }, [note.fontSize, onFontSizeChange]);

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Tıklamanın sürükleme olarak algılanmasını engelle
    if (e.currentTarget) {
      e.currentTarget.setAttribute('data-no-drag', 'true');
    }
    
    const willClose = isMenuVisible;
    setIsMenuVisible(!isMenuVisible);
    if (willClose) {
      setIsColorPickerVisible(false);
      setIsFontPickerVisible(false);
    }
  }, [isMenuVisible]);

  const handleColorClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Notun mevcut rengini HEX'e çevir
    const rgba = note.color.match(/[\d.]+/g);
    if (rgba && rgba.length >= 3) {
      const r = parseInt(rgba[0]).toString(16).padStart(2, '0');
      const g = parseInt(rgba[1]).toString(16).padStart(2, '0');
      const b = parseInt(rgba[2]).toString(16).padStart(2, '0');
      setCustomColor(`#${r}${g}${b}`);
    }

    setIsColorPickerVisible(!isColorPickerVisible);
    setIsFontPickerVisible(false);
  }, [isColorPickerVisible, note.color]);

  const handleColorSelect = useCallback((color: string) => {
    onColorChange(color);
    setIsColorPickerVisible(false);
    setIsMenuVisible(false);
  }, [onColorChange]);

  const handleCustomColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    if (onColorChange) {
      // HEX'i RGBA'ya çevir
      const r = parseInt(newColor.substring(1,3), 16);
      const g = parseInt(newColor.substring(3,5), 16);
      const b = parseInt(newColor.substring(5,7), 16);
      onColorChange(`rgba(${r}, ${g}, ${b}, 0.95)`);
    }
  }, [onColorChange]);

  const handleCustomColorClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // HEX'e çevir
    const rgba = note.color.match(/[\d.]+/g);
    if (rgba && rgba.length >= 3) {
      const r = parseInt(rgba[0]).toString(16).padStart(2, '0');
      const g = parseInt(rgba[1]).toString(16).padStart(2, '0');
      const b = parseInt(rgba[2]).toString(16).padStart(2, '0');
      setCustomColor(`#${r}${g}${b}`);
    }
    // Input'u simüle et
    const input = document.getElementById(`color-picker-${note.id}`) as HTMLInputElement;
    if (input) {
      input.click();
    }
  }, [note.color, note.id]);

  const handleFontClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFontPickerVisible(!isFontPickerVisible);
    setIsColorPickerVisible(false);
  }, [isFontPickerVisible]);

  const handleFontSelect = useCallback((font: Font) => {
    if (onFontChange) {
      // Sadece font ailesini değiştir, boyutu değiştirme
      onFontChange(font.family);
    }
    
    setIsFontPickerVisible(false);
    setIsMenuVisible(false);
  }, [onFontChange]);

  return (
      <StyledNote
        ref={noteRef}
        isEditing={isEditing}
        note={note}
        style={{
          width: note.width || NOTE_DEFAULT_WIDTH,
          height: note.height || NOTE_DEFAULT_HEIGHT,
          backgroundColor: note.color
        }}
        onDoubleClick={note.isCompleted ? undefined : onDoubleClick}
        onClick={(e) => {
          // Menü veya renk seçici üzerinde tıklanmadıysa menüleri kapat
          const target = e.target as HTMLElement;
          if (!target.closest('.note-menu') && !target.closest('.color-picker') && !target.closest('.font-picker')) {
            setIsMenuVisible(false);
            setIsColorPickerVisible(false);
            setIsFontPickerVisible(false);
          }
        }}
        data-id={`note-${note.id}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NoteContent
          ref={contentRef}
          contentEditable={isEditing && !note.isCompleted}
          suppressContentEditableWarning
          style={{
            fontSize: `${note.fontSize}rem`,
            fontFamily: note.fontFamily || fonts[0].family
          }}
          onBlur={(e) => {
            if (note.isCompleted) return;
            const content = e.currentTarget.innerHTML
              .replace(/<div><br><\/div>/g, '\n') // Boş satırları önce işle
              .replace(/<div>/g, '\n')
              .replace(/<\/div>/g, '')
              .replace(/<br\s*\/?>/g, '\n')
              .replace(/&nbsp;/g, ' ')
              .replace(/<a[^>]*>(.*?)<\/a>/g, '$1') // Link etiketlerini temizle
              .replace(/\n{3,}/g, '\n\n') // Üç veya daha fazla satır sonunu iki satır sonuna indir
              .trim();
            onContentChange(content);
          }}
          dangerouslySetInnerHTML={{
            __html: convertLinksToAnchors(note.content)
          }}
          onClick={(e) => {
            // Link tıklamalarını yönet
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' && !isEditing) {
              e.stopPropagation();
              e.preventDefault();
              const url = target.getAttribute('data-url');
              if (url) {
                const ipcRenderer = getIpcRendererOrMock();
                ipcRenderer.send('open-external-url', url);
              }
            }
          }}
        />

        <MenuButton
          onClick={handleMenuClick}
          className="note-menu"
          isHovering={shouldShowMenu}
          isDragging={false}
          data-no-drag="true"
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <MdMoreVert />
        </MenuButton>

        <MenuOverlay
          isVisible={isMenuVisible}
          className="note-menu"
          isDragging={!shouldShowMenu}
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <MenuItem onClick={handleFontClick}>
            <MdFormatSize />
          </MenuItem>
          <MenuItem onClick={handleDecreaseFontSize}>
            <MdTextDecrease />
          </MenuItem>
          <MenuItem onClick={handleIncreaseFontSize}>
            <MdTextIncrease />
          </MenuItem>
          <MenuItem onClick={handleColorClick}>
            <MdOutlineColorLens />
          </MenuItem>
          <MenuItem 
            onClick={() => onToggleComplete()}
            style={{ 
              background: note.isCompleted ? 'var(--menu-item-active-bg, rgba(76, 175, 80, 0.2))' : undefined,
              color: note.isCompleted ? 'var(--menu-item-active-color, rgba(76, 175, 80, 1))' : undefined,
              border: note.isCompleted ? '1px solid var(--menu-item-active-border, rgba(76, 175, 80, 0.3))' : '1px solid transparent'
            }}
          >
            <MdDone />
          </MenuItem>
          <MenuItem 
            onClick={() => onToggleLock()}
            style={{ 
              background: note.isLocked ? 'var(--menu-item-active-bg, rgba(33, 150, 243, 0.2))' : undefined,
              color: note.isLocked ? 'var(--menu-item-active-color, rgba(33, 150, 243, 1))' : undefined,
              border: note.isLocked ? '1px solid var(--menu-item-active-border, rgba(33, 150, 243, 0.3))' : '1px solid transparent'
            }}
          >
            {note.isLocked ? <MdLock /> : <MdLockOpen />}
          </MenuItem>
          {isFontPickerVisible && (
            <FontPicker>
              {fonts.map((font) => (
                <FontOption
                  key={font.id}
                  isSelected={note.fontFamily 
                    ? note.fontFamily === font.family 
                    : font.id === 'caveat'}
                  onClick={() => handleFontSelect(font)}
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </FontOption>
              ))}
            </FontPicker>
          )}
          {isColorPickerVisible && (
            <ColorPicker>
              {NOTE_COLORS.map((color, index) => (
                <ColorOption
                  key={index}
                  color={color}
                  isSelected={note.color === color}
                  onClick={() => {
                    if (onColorChange) onColorChange(color);
                    setIsColorPickerVisible(false);
                  }}
                />
              ))}
              <ColorOption
                color="transparent"
                isSelected={false}
                onClick={handleCustomColorClick}
                className="custom-color-button"
              >
                <MdColorize />
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  onClick={(e) => e.stopPropagation()}
                  className="custom-color-input"
                  id={`color-picker-${note.id}`}
                />
              </ColorOption>
            </ColorPicker>
          )}
        </MenuOverlay>

        {note.createdAt && (
          <NoteDate style={{ fontFamily: note.fontFamily || fonts[0].family }} isLocked={note.isLocked}>
            {note.createdAt.toLocaleDateString(navigator.language, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </NoteDate>
        )}

        {children}
      </StyledNote>
  );
};
