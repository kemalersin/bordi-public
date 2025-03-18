import { app } from 'electron';

type TranslationType = {
  [key: string]: {
    tray: {
      quit: string;
      show: string;
      hide: string;
    };
    dialog: {
      mediaFiles: string;
    };
    board: {
      defaultName: string;
    };
  };
};


const translations: TranslationType = {
  tr: {
    tray: {
      quit: 'Bordi\'den çık',
      show: 'Göster',
      hide: 'Gizle'
    },
    dialog: {
      mediaFiles: 'Medya Dosyaları'
    },
    board: {
      defaultName: 'Merhaba Bordi'
    }
  },
  en: {
    tray: {
      quit: 'Quit Bordi',
      show: 'Show',
      hide: 'Hide'
    },
    dialog: {
      mediaFiles: 'Media Files'
    },
    board: {
      defaultName: 'Hello Bordi'
    }
  },
  fr: {
    tray: {
      quit: 'Quitter Bordi',
      show: 'Afficher',
      hide: 'Masquer'
    },
    dialog: {
      mediaFiles: 'Fichiers Média'
    },
    board: {
      defaultName: 'Bonjour Bordi'
    }
  },

  de: {
    tray: {
      quit: 'Bordi beenden',
      show: 'Anzeigen',
      hide: 'Ausblenden'
    },
    dialog: {
      mediaFiles: 'Medien Dateien'
    },
    board: {
      defaultName: 'Hallo Bordi'
    }
  },

  es: {
    tray: {
      quit: 'Salir de Bordi',
      show: 'Mostrar',
      hide: 'Ocultar'
    },
    dialog: {
      mediaFiles: 'Archivos de Medios'
    },
    board: {
      defaultName: 'Hola Bordi'
    }
  },

  ja: {
    tray: {
      quit: 'Bordiを終了',
      show: '表示',
      hide: '非表示'
    },
    dialog: {
      mediaFiles: 'メディアファイル'
    },
    board: {
      defaultName: 'こんにちは Bordi'
    }
  },

  zh: {
    tray: {
      quit: '退出 Bordi',
      show: '显示',
      hide: '隐藏'
    },
    dialog: {
      mediaFiles: '媒体文件'
    },
    board: {
      defaultName: '你好 Bordi'
    }
  },

  ru: {
    tray: {
      quit: 'Выйти из Bordi',
      show: 'Показать',
      hide: 'Скрыть'
    },
    dialog: {
      mediaFiles: 'Медиафайлы'
    },
    board: {
      defaultName: 'Привет Bordi'
    }
  },

  it: {
    tray: {
      quit: 'Esci da Bordi',
      show: 'Mostra',
      hide: 'Nascondi'
    },
    dialog: {
      mediaFiles: 'File di Media'
    },
    board: {
      defaultName: 'Ciao Bordi'
    }
  },
  ko: {
    tray: {
      quit: 'Bordi 종료',
      show: '표시',
      hide: '숨기기'
    },
    dialog: {
      mediaFiles: '미디어 파일'
    },
    board: {
      defaultName: '안녕 Bordi'
    }
  }
};


export function getTranslation(key: string): string {
  const locale = app.getLocale().split('-')[0];
  const supportedLocale = Object.keys(translations).includes(locale) ? locale : 'en';
  
  const keys = key.split('.');
  let value: any = translations[supportedLocale];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return value || key;
} 