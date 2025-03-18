import { useTranslations } from '../hooks/useTranslations';

export const getFontList = () => {
  const translations = useTranslations();

  return [
    {
      id: 'caveat',
      name: translations.fonts.handwritten,
      family: "'Caveat', cursive"
    },
    {
      id: 'system',
      name: translations.fonts.system,
      family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    },
    {
      id: 'monospace',
      name: translations.fonts.terminal,
      family: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace"
    }
  ];
}; 