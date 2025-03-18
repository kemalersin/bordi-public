import React, { useState, useCallback, useEffect } from 'react';
import { VideoUrlDialogProps } from '../types/VideoUrlDialog.types';
import { DialogArea, DialogContent } from '../styles/VideoUrlDialog.styles';
import ReactPlayer from 'react-player';
import Draggable from 'react-draggable';
import { useTranslations } from '../hooks/useTranslations';
import { getIpcRendererOrMock } from '../utils/electron';

const ipcRenderer = getIpcRendererOrMock();

const isValidVideoUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        return (
            urlObj.hostname.includes('youtube.com') ||
            urlObj.hostname.includes('youtu.be') ||
            urlObj.hostname.includes('vimeo.com') ||
            urlObj.hostname.includes('wistia.com')
        );
    } catch {
        return false;
    }
};

export const VideoUrlDialog: React.FC<VideoUrlDialogProps> = ({
    isOpen,
    onClose,
    onSubmit
}) => {
    const [url, setUrl] = useState('');
    const isValid = ReactPlayer.canPlay(url) && isValidVideoUrl(url);
    const translations = useTranslations();

    const handleSubmit = useCallback(() => {
        if (isValid) {
            onSubmit(url);
            setUrl('');
            onClose();
        }
    }, [url, isValid, onSubmit, onClose]);

    if (!isOpen) return null;

    return (
        <DialogArea className="video-dialog-area">
            <Draggable>
                <DialogContent>
                    <h2>{translations.videoUrlDialog.title}</h2>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={translations.videoUrlDialog.placeholder}
                        autoFocus
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                    <div className="supported-sites">
                        {translations.videoUrlDialog.supportedSites}
                    </div>
                    <div className="buttons">
                        <button onClick={onClose}>
                            {translations.videoUrlDialog.cancel}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid}
                            className={isValid ? 'primary' : ''}
                        >
                            {translations.videoUrlDialog.submit}
                        </button>
                    </div>
                </DialogContent>
            </Draggable>
        </DialogArea>
    );
}; 