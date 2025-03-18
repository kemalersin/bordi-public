import React from 'react';
import { Board, ClickableArea } from '../styles/Board.styles';
import { TiltedContainer } from './TiltedContainer';
import { Note } from './Note';
import { MediaFrame } from './MediaFrame';
import { Pin } from './Pin';
import { ConnectionLine } from './ConnectionLine';
import { TrashBin } from './TrashBin';
import { ActionBar } from './ActionBar';
import { VideoUrlDialog } from './VideoUrlDialog';
import { ImageModal } from './ImageModal';
import { BoardDialog } from './BoardDialog';
import { BoardListDialog } from './BoardListDialog';
import { useItemInteraction } from '../hooks/useItemInteraction';
import { ResizableNote } from './ResizableNote';
import { ResizableMedia } from './ResizableMedia';
import { FavoriteBoards } from './FavoriteBoards';

export function AppRender(props: {
  state: ReturnType<typeof import('../hooks/useAppState').useAppState>;
  hooks: ReturnType<typeof import('../hooks/useAppHooks').useAppHooks>;
}) {
  const {
    notes,
    medias,
    maxZIndex,
    isDragging,
    isDraggingDelayed,
    editingNoteId,
    pins,
    ropes,
    draggedPin,
    temporaryRope,
    isDragOverTrash,
    draggedItemInfo,
    areItemsVisible,
    isHiding,
    isInitialRender,
    isVideoUrlDialogOpen, setIsVideoUrlDialogOpen,
    modalImage, setModalImage,
    areFontsLoaded,
    background,
    isBoardDialogOpen, setIsBoardDialogOpen,
    isBoardListDialogOpen, setIsBoardListDialogOpen,
    boards
  } = props.state;

  const {
    handleMouseMove,
    contextMenuHandler,
    handleAddNoteFromBar,
    handleAddMediaFromBar,
    handleToggleVisibility,
    handleMouseEnter,
    handleMouseLeave,
    handleDragStart,
    handleDrag,
    handleDragStop,
    handlePinMouseDown,
    handlePinMouseUp,
    handlePinRemove,
    handleNoteDoubleClick,
    handleNoteContentChange,
    handleNoteFontSizeChange,
    handleNoteColorChange,
    handleNoteFontChange,
    handleNoteToggleComplete,
    handleNoteToggleLock,
    handleAddVideoUrl,
    handleBackgroundChange,
    handleNoteResize,
    handleNoteResizeComplete,
    handleMediaResize,
    handleMediaResizeComplete,
    handleMediaUpdate,
    handleMediaToggleLock,
    handleAddBoard,
    handleBoardSubmit,
    handleBoardSelect,
    handleBoardDelete,
    handleFavorite
  } = props.hooks;

  return (
    /**
     * Ana Board Bileşeni
     * - Tüm uygulama içeriğini kapsar
     * - Mouse hareketlerini ve context menu'yü yönetir
     */
    <Board
      className={`board ${isHiding ? 'hiding' : ''}`}
      onMouseMove={handleMouseMove}
      onContextMenu={contextMenuHandler}
      isInitialRender={isInitialRender}
      style={{
        background: background.type === 'transparent'
          ? 'transparent'
          : background.type === 'color'
          ? background.value
          : background.type === 'image'
          ? `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url(${background.value})`
          : 'transparent',
        backgroundSize: background.type === 'image' ? 'cover' : undefined,
        backgroundPosition: background.type === 'image' ? 'center' : undefined,
        backgroundRepeat: background.type === 'image' ? 'no-repeat' : undefined,
        opacity: isHiding && background.type !== 'transparent' ? 0 : 1,
        visibility: areFontsLoaded ? 'visible' : 'hidden'
      }}
    >
      {areFontsLoaded && (
        <>
          {/* Tıklanabilir Alan */}
          <ClickableArea
            isVisible={areItemsVisible}
            isHiding={isHiding}
          >
            {/* İpler */}
            {/* Kalıcı İpler */}
            {ropes.map(rope => {
              const parentZIndex = rope.startPin.parentType === 'note'
                ? notes.find(n => n.id === rope.startPin.parentId)?.zIndex || 1
                : medias.find(m => m.id === rope.startPin.parentId)?.zIndex || 1;

              return (
                <ConnectionLine
                  key={rope.id}
                  rope={rope}
                  zIndex={parentZIndex + 1}
                />
              );
            })}
            {/* Geçici İp (Pin sürüklenirken) */}
            {temporaryRope && (() => {
              return (
                <ConnectionLine
                  rope={temporaryRope}
                  zIndex={maxZIndex + 1}
                />
              );
            })()}

            {/* Notlar */}
            {notes.map(note => {
              const notePin = pins.find(pin => pin.parentId === note.id && pin.parentType === 'note');

              const interactionState = useItemInteraction(
                note.id,
                'note',
                draggedItemInfo,
                isDragOverTrash,
                {
                  onMouseEnter: handleMouseEnter,
                  onMouseLeave: handleMouseLeave,
                  onDragStart: handleDragStart,
                  onDrag: handleDrag,
                  onDragStop: handleDragStop
                }
              );

              return (
                /**
                 * Not Container
                 * - Döndürme efekti
                 * - Hover durumunda düzleşme
                 * - Çöp kutusu üzerinde yarı saydamlık
                 * - Z-index yönetimi
                 */
                <TiltedContainer
                  key={note.id}
                  rotation={note.rotation}
                  zIndex={note.zIndex}
                  x={note.x}
                  y={note.y}
                  isDisabled={editingNoteId === note.id}
                  isDragOverTrash={interactionState.isDragOverTrash}
                  isResizing={note.isResizing}
                  isLocked={note.isLocked}
                  onMouseEnter={() => interactionState.onMouseEnter()}
                  onMouseLeave={interactionState.onMouseLeave}
                  onDragStart={interactionState.onDragStart}
                  onDrag={interactionState.onDrag}
                  onDragStop={interactionState.onDragStop}
                >
                  {/* Boyutlandırılabilir Not Bileşeni */}
                  <ResizableNote
                    note={note}
                    isEditing={editingNoteId === note.id}
                    onDoubleClick={() => handleNoteDoubleClick(note.id)}
                    onContentChange={(content) => handleNoteContentChange(note.id, content)}
                    onFontSizeChange={(fontSize) => handleNoteFontSizeChange(note.id, fontSize)}
                    onColorChange={(color) => handleNoteColorChange(note.id, color)}
                    onFontChange={(fontFamily) => handleNoteFontChange(note.id, fontFamily)}
                    onToggleComplete={() => handleNoteToggleComplete(note.id)}
                    onToggleLock={() => handleNoteToggleLock(note.id)}
                    isDragging={isDragging}
                    onResize={(width, height) => handleNoteResize(note.id, width, height)}
                    onResizeComplete={(width, height) => handleNoteResizeComplete(note.id, width, height)}
                  >
                    {/* Not üzerindeki Pin */}
                    {notePin && (
                      <Pin
                        key={notePin.id}
                        pin={notePin}
                        position={{ x: 0, y: 0, width: 0, height: 0, rotation: note.rotation }}
                        isActive={draggedPin?.id === notePin.id}
                        onMouseDown={() => handlePinMouseDown(notePin)}
                        onMouseUp={() => handlePinMouseUp(notePin)}
                        onRemove={() => handlePinRemove(notePin)}
                        zIndex={note.zIndex + 2}
                      />
                    )}
                  </ResizableNote>
                </TiltedContainer>
              );
            })}

            {/* Fotoğraflar */}
            {medias.map(media => {
              const mediaPin = pins.find(pin => pin.parentId === media.id && pin.parentType === 'media');

              const interactionState = useItemInteraction(
                media.id,
                'media',
                draggedItemInfo,
                isDragOverTrash,
                {
                  onMouseEnter: handleMouseEnter,
                  onMouseLeave: handleMouseLeave,
                  onDragStart: handleDragStart,
                  onDrag: handleDrag,
                  onDragStop: handleDragStop
                }
              );

              return (
                <ResizableMedia
                  key={media.id}
                  media={media}
                  isDragging={isDragging}
                  onImageDoubleClick={() => setModalImage(media.src)}
                  isVisible={areItemsVisible}
                  onResize={(width, height) => handleMediaResize(media.id, width, height)}
                  onResizeComplete={(width, height) => handleMediaResizeComplete(media.id, width, height)}
                  interactionState={interactionState}
                  areItemsVisible={areItemsVisible}
                  onUpdateMedia={(updatedMedia) => handleMediaUpdate(media.id, updatedMedia)}
                  onToggleLock={handleMediaToggleLock}
                >
                  {mediaPin && (
                    <Pin
                      key={mediaPin.id}
                      pin={mediaPin}
                      position={{ x: 0, y: 0, width: 0, height: 0, rotation: media.rotation }}
                      isActive={draggedPin?.id === mediaPin.id}
                      onMouseDown={() => handlePinMouseDown(mediaPin)}
                      onMouseUp={() => handlePinMouseUp(mediaPin)}
                      onRemove={() => handlePinRemove(mediaPin)}
                      zIndex={media.zIndex + 2}
                    />
                  )}
                </ResizableMedia>
              );
            })}
          </ClickableArea>
        </>
      )}

      {/* Action Bar */}
      <ActionBar
        isDragging={isDraggingDelayed}
        onAddNote={handleAddNoteFromBar}
        onAddMedia={handleAddMediaFromBar}
        onAddVideoUrl={() => setIsVideoUrlDialogOpen(true)}
        onToggleVisibility={handleToggleVisibility}
        onBackgroundChange={handleBackgroundChange}
        onAddBoard={handleAddBoard}
        onSelectBoard={() => setIsBoardListDialogOpen(true)}
        currentBackground={background}
        boards={boards}
      />

      {/* Favori Panolar */}
      <FavoriteBoards
        boards={boards}
        onBoardSelect={handleBoardSelect}
        isDragging={isDraggingDelayed}
        activeBoard={props.state.activeBoard || undefined}
      />

      {/* Çöp Kutusu */}
      <TrashBin
        isDragOver={isDragOverTrash}
        isVisible={isDraggingDelayed}
      />

      {/* Video URL Dialog */}
      <VideoUrlDialog
        isOpen={isVideoUrlDialogOpen}
        onClose={() => setIsVideoUrlDialogOpen(false)}
        onSubmit={handleAddVideoUrl}
      />

      {/* Board Dialog */}
      <BoardDialog
        isOpen={isBoardDialogOpen}
        onClose={() => setIsBoardDialogOpen(false)}
        onSubmit={handleBoardSubmit}
      />

      {/* Board List Dialog */}
      <BoardListDialog
        isOpen={isBoardListDialogOpen}
        onClose={() => setIsBoardListDialogOpen(false)}
        onBoardSelect={handleBoardSelect}
        onBoardDelete={handleBoardDelete}
        onBoardFavorite={handleFavorite}
      />

      <ImageModal
        src={modalImage || ''}
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
      />
    </Board>
  );
} 