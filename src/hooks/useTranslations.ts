import { useState, useEffect } from 'react';

type Translations = {
  actionBar: {
    addNote: string;
    addImage: string;
    addVideo: string;
    toggleVisibility: string;
    quit: string;
    displays: string;
    screen: string;
    primary: string;
    background: string;
    addBoard: string;
    selectBoard: string;
  };
  note: {
    newNote: string;
  };
  fonts: {
    handwritten: string;
    system: string;
    terminal: string;
  };
  videoUrlDialog: {
    title: string;
    placeholder: string;
    supportedSites: string;
    cancel: string;
    submit: string;
  };
  boardDialog: {
    title: string;
    placeholder: string;
    cancel: string;
    submit: string;
  };
  boardListDialog: {
    title: string;
    close: string;
    defaultBoard: string;
    searchPlaceholder: string;
  };
  alerts: {
    unsupportedFile: string;
    uploadError: string;
  };
};

const tr: Translations = {
  actionBar: {
    addNote: "Not Ekle",
    addImage: "Resim Ekle",
    addVideo: "Video Ekle",
    toggleVisibility: "Görünürlüğü Değiştir",
    quit: "Uygulamadan Çık",
    displays: "Ekranlar",
    screen: "Ekran",
    primary: "Birincil",
    background: "Arkaplan",
    addBoard: "Yeni Pano",
    selectBoard: "Pano Seç"
  },
  note: {
    newNote: "Yeni Not"
  },
  fonts: {
    handwritten: "El Yazısı",
    system: "Sistem Yazı Tipi",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Video URL'si Ekle",
    placeholder: "Video URL'sini girin",
    supportedSites: "Desteklenen siteler: YouTube, Vimeo, Wistia",
    cancel: "İptal",
    submit: "Tamam"
  },
  boardDialog: {
    title: "Yeni Pano Ekle",
    placeholder: "Pano adını girin",
    cancel: "İptal",
    submit: "Tamam"
  },
  boardListDialog: {
    title: "Pano Seç",
    close: "Kapat",
    defaultBoard: "Varsayılan Pano",
    searchPlaceholder: "Pano ara..."
  },
  alerts: {
    unsupportedFile: "Desteklenmeyen dosya türü. Lütfen bir resim ya da video dosyası seçin.",
    uploadError: "Dosya yüklenirken bir hata oluştu."
  }
};

const en: Translations = {
  actionBar: {
    addNote: "Add Note",
    addImage: "Add Image",
    addVideo: "Add Video",
    toggleVisibility: "Toggle Visibility",
    quit: "Quit Application",
    displays: "Displays",
    screen: "Screen",
    primary: "Primary",
    background: "Background",
    addBoard: "New Board",
    selectBoard: "Select Board"
  },
  note: {
    newNote: "New Note"
  },
  fonts: {
    handwritten: "Handwritten",
    system: "System Font",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Add Video URL",
    placeholder: "Enter video URL",
    supportedSites: "Supported sites: YouTube, Vimeo, Wistia",
    cancel: "Cancel",
    submit: "OK"
  },
  boardDialog: {
    title: "Add New Board",
    placeholder: "Enter board name",
    cancel: "Cancel",
    submit: "OK"
  },
  boardListDialog: {
    title: "Select Board",
    close: "Close",
    defaultBoard: "Default Board",
    searchPlaceholder: "Search boards..."
  },
  alerts: {
    unsupportedFile: "Unsupported file type. Please select an image or video file.",
    uploadError: "An error occurred while uploading the file."
  }
};

const fr: Translations = {
  actionBar: {
    addNote: "Ajouter une Note",
    addImage: "Ajouter une Image",
    addVideo: "Ajouter une Vidéo",
    toggleVisibility: "Basculer la Visibilité",
    quit: "Quitter l'Application",
    displays: "Écrans",
    screen: "Écran",
    primary: "Principal",
    background: "Arrière-plan",
    addBoard: "Nouveau Tableau",
    selectBoard: "Sélectionner le tableau"
  },
  note: {
    newNote: "Nouvelle Note"
  },
  fonts: {
    handwritten: "Manuscrite",
    system: "Police Système",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Ajouter une URL de Vidéo",
    placeholder: "Entrez l'URL de la vidéo",
    supportedSites: "Sites supportés: YouTube, Vimeo, Wistia",
    cancel: "Annuler",
    submit: "OK"
  },
  boardDialog: {
    title: "Ajouter un Nouveau Tableau",
    placeholder: "Entrez le nom du tableau",
    cancel: "Annuler",
    submit: "OK"
  },
  boardListDialog: {
    title: "Sélectionner le tableau",
    close: "Fermer",
    defaultBoard: "Tableau par défaut",
    searchPlaceholder: "Rechercher des tableaux..."
  },
  alerts: {
    unsupportedFile: "Type de fichier non pris en charge. Veuillez sélectionner une image ou une vidéo.",
    uploadError: "Une erreur s'est produite lors du téléchargement du fichier."
  }
};

const de: Translations = {
  actionBar: {
    addNote: "Notiz Hinzufügen",
    addImage: "Bild Hinzufügen",
    addVideo: "Video Hinzufügen",
    toggleVisibility: "Sichtbarkeit Umschalten",
    quit: "Anwendung Beenden",
    displays: "Bildschirme",
    screen: "Bildschirm",
    primary: "Primär",
    background: "Hintergrund",
    addBoard: "Neue Tafel",
    selectBoard: "Tafel auswählen"
  },
  note: {
    newNote: "Neue Notiz"
  },
  fonts: {
    handwritten: "Handschriftlich",
    system: "Systemschrift",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Video-URL Hinzufügen",
    placeholder: "Video-URL eingeben",
    supportedSites: "Unterstützte Seiten: YouTube, Vimeo, Wistia",
    cancel: "Abbrechen",
    submit: "OK"
  },
  boardDialog: {
    title: "Neue Tafel Hinzufügen",
    placeholder: "Tafelname eingeben",
    cancel: "Abbrechen",
    submit: "OK"
  },
  boardListDialog: {
    title: "Tafel auswählen",
    close: "Schließen",
    defaultBoard: "Standardtafel",
    searchPlaceholder: "Tafeln suchen..."
  },
  alerts: {
    unsupportedFile: "Nicht unterstützter Dateityp. Bitte wählen Sie eine Bild- oder Videodatei aus.",
    uploadError: "Beim Hochladen der Datei ist ein Fehler aufgetreten."
  }
};

const es: Translations = {
  actionBar: {
    addNote: "Agregar Nota",
    addImage: "Agregar Imagen",
    addVideo: "Agregar Video",
    toggleVisibility: "Alternar Visibilidad",
    quit: "Salir de la Aplicación",
    displays: "Pantallas",
    screen: "Pantalla",
    primary: "Principal",
    background: "Fondo",
    addBoard: "Nueva Pizarra",
    selectBoard: "Seleccionar Tablero"
  },
  note: {
    newNote: "Nueva Nota"
  },
  fonts: {
    handwritten: "Manuscrita",
    system: "Fuente del Sistema",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Agregar URL de Video",
    placeholder: "Ingrese la URL del video",
    supportedSites: "Sitios soportados: YouTube, Vimeo, Wistia",
    cancel: "Cancelar",
    submit: "OK"
  },
  boardDialog: {
    title: "Agregar Nueva Pizarra",
    placeholder: "Ingrese el nombre de la pizarra",
    cancel: "Cancelar",
    submit: "OK"
  },
  boardListDialog: {
    title: "Seleccionar Tablero",
    close: "Cerrar",
    defaultBoard: "Tablero Predeterminado",
    searchPlaceholder: "Buscar tableros..."
  },
  alerts: {
    unsupportedFile: "Tipo de archivo no soportado. Por favor, seleccione un archivo de imagen o video.",
    uploadError: "Se produjo un error al cargar el archivo."
  }
};

const ja: Translations = {
  actionBar: {
    addNote: "メモを追加",
    addImage: "画像を追加",
    addVideo: "動画を追加",
    toggleVisibility: "表示切替",
    quit: "アプリケーションを終了",
    displays: "ディスプレイ",
    screen: "画面",
    primary: "プライマリ",
    background: "背景",
    addBoard: "新しいボード",
    selectBoard: "ボードを選択"
  },
  note: {
    newNote: "新規メモ"
  },
  fonts: {
    handwritten: "手書き",
    system: "システムフォント",
    terminal: "ターミナル"
  },
  videoUrlDialog: {
    title: "動画URLを追加",
    placeholder: "動画URLを入力",
    supportedSites: "対応サイト: YouTube, Vimeo, Wistia",
    cancel: "キャンセル",
    submit: "OK"
  },
  boardDialog: {
    title: "新しいボードを追加",
    placeholder: "ボードの名前を入力",
    cancel: "キャンセル",
    submit: "OK"
  },
  boardListDialog: {
    title: "ボードを選択",
    close: "閉じる",
    defaultBoard: "デフォルトボード",
    searchPlaceholder: "ボードを検索..."
  },
  alerts: {
    unsupportedFile: "サポートされていないファイル形式です。画像または動画ファイルを選択してください。",
    uploadError: "ファイルのアップロード中にエラーが発生しました。"
  }
};

const zh: Translations = {
  actionBar: {
    addNote: "添加笔记",
    addImage: "添加图片",
    addVideo: "添加视频",
    toggleVisibility: "切换可见性",
    quit: "退出应用",
    displays: "显示器",
    screen: "屏幕",
    primary: "主要",
    background: "背景",
    addBoard: "新建面板",
    selectBoard: "选择面板"
  },
  note: {
    newNote: "新笔记"
  },
  fonts: {
    handwritten: "手写",
    system: "系统字体",
    terminal: "终端"
  },
  videoUrlDialog: {
    title: "添加视频URL",
    placeholder: "输入视频URL",
    supportedSites: "支持的网站: YouTube, Vimeo, Wistia",
    cancel: "取消",
    submit: "确定"
  },
  boardDialog: {
    title: "新建面板",
    placeholder: "输入面板名称",
    cancel: "取消",
    submit: "确定"
  },
  boardListDialog: {
    title: "选择面板",
    close: "关闭",
    defaultBoard: "默认面板",
    searchPlaceholder: "搜索面板..."
  },
  alerts: {
    unsupportedFile: "不支持的文件类型。请选择图片或视频文件。",
    uploadError: "上传文件时发生错误。"
  }
};

const ru: Translations = {
  actionBar: {
    addNote: "Добавить заметку",
    addImage: "Добавить изображение",
    addVideo: "Добавить видео",
    toggleVisibility: "Переключить видимость",
    quit: "Выйти из приложения",
    displays: "Дисплеи",
    screen: "Экран",
    primary: "Основной",
    background: "Фон",
    addBoard: "Новая доска",
    selectBoard: "Выбрать доску"
  },
  note: {
    newNote: "Новая заметка"
  },
  fonts: {
    handwritten: "Рукописный",
    system: "Системный шрифт",
    terminal: "Терминал"
  },
  videoUrlDialog: {
    title: "Добавить URL видео",
    placeholder: "Введите URL видео",
    supportedSites: "Поддерживаемые сайты: YouTube, Vimeo, Wistia",
    cancel: "Отмена",
    submit: "OK"
  },
  boardDialog: {
    title: "Добавить новую доску",
    placeholder: "Введите название доски",
    cancel: "Отмена",
    submit: "OK"
  },
  boardListDialog: {
    title: "Выбрать доску",
    close: "Закрыть",
    defaultBoard: "Доска по умолчанию",
    searchPlaceholder: "Поиск досок..."
  },
  alerts: {
    unsupportedFile: "Неподдерживаемый тип файла. Пожалуйста, выберите изображение или видео файл.",
    uploadError: "Произошла ошибка при загрузке файла."
  }
};

const it: Translations = {
  actionBar: {
    addNote: "Aggiungi Nota",
    addImage: "Aggiungi Immagine",
    addVideo: "Aggiungi Video",
    toggleVisibility: "Cambia Visibilità",
    quit: "Esci dall'Applicazione",
    displays: "Schermi",
    screen: "Schermo",
    primary: "Principale",
    background: "Sfondo",
    addBoard: "Nuova Tavola",
    selectBoard: "Seleziona Tavolo"
  },
  note: {
    newNote: "Nuova Nota"
  },
  fonts: {
    handwritten: "Manoscritta",
    system: "Font di Sistema",
    terminal: "Terminale"
  },
  videoUrlDialog: {
    title: "Aggiungi URL Video",
    placeholder: "Inserisci URL del video",
    supportedSites: "Siti supportati: YouTube, Vimeo, Wistia",
    cancel: "Annulla",
    submit: "OK"
  },
  boardDialog: {
    title: "Aggiungi Nuova Tavola",
    placeholder: "Inserisci il nome della tavola",
    cancel: "Annulla",
    submit: "OK"
  },
  boardListDialog: {
    title: "Seleziona Tavolo",
    close: "Chiudi",
    defaultBoard: "Tavolo predefinito",
    searchPlaceholder: "Cerca tavoli..."
  },
  alerts: {
    unsupportedFile: "Tipo di file non supportato. Seleziona un file immagine o video.",
    uploadError: "Si è verificato un errore durante il caricamento del file."
  }
};

const ko: Translations = {
  actionBar: {
    addNote: "메모 추가",
    addImage: "이미지 추가",
    addVideo: "비디오 추가",
    toggleVisibility: "가시성 전환",
    quit: "앱 종료",
    displays: "디스플레이",
    screen: "화면",
    primary: "기본",
    background: "배경",
    addBoard: "새 보드",
    selectBoard: "보드 선택"
  },
  note: {
    newNote: "새 메모"
  },
  fonts: {
    handwritten: "손글씨",
    system: "시스템 글꼴",
    terminal: "터미널"
  },
  videoUrlDialog: {
    title: "비디오 URL 추가",
    placeholder: "비디오 URL 입력",
    supportedSites: "지원 사이트: YouTube, Vimeo, Wistia",
    cancel: "취소",
    submit: "확인"
  },
  boardDialog: {
    title: "새 보드 추가",
    placeholder: "보드 이름 입력",
    cancel: "취소",
    submit: "확인"
  },
  boardListDialog: {
    title: "보드 선택",
    close: "닫기",
    defaultBoard: "기본 보드",
    searchPlaceholder: "보드 검색..."
  },
  alerts: {
    unsupportedFile: "지원되지 않는 파일 형식입니다. 이미지 또는 비디오 파일을 선택하세요.",
    uploadError: "파일 업로드 중 오류가 발생했습니다."
  }
};

const pt: Translations = {
  actionBar: {
    addNote: "Adicionar Nota",
    addImage: "Adicionar Imagem",
    addVideo: "Adicionar Vídeo",
    toggleVisibility: "Alternar Visibilidade",
    quit: "Sair do Aplicativo",
    displays: "Telas",
    screen: "Tela",
    primary: "Principal",
    background: "Fundo",
    addBoard: "Nova Tela",
    selectBoard: "Selecionar Tela"
  },
  note: {
    newNote: "Nova Nota"
  },
  fonts: {
    handwritten: "Manuscrita",
    system: "Fonte do Sistema",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Adicionar URL do Vídeo",
    placeholder: "Digite a URL do vídeo",
    supportedSites: "Sites suportados: YouTube, Vimeo, Wistia",
    cancel: "Cancelar",
    submit: "OK"
  },
  boardDialog: {
    title: "Adicionar Nova Tela",
    placeholder: "Digite o nome da tela",
    cancel: "Cancelar",
    submit: "OK"
  },
  boardListDialog: {
    title: "Selecionar Tela",
    close: "Fechar",
    defaultBoard: "Tela padrão",
    searchPlaceholder: "Pesquisar telas..."
  },
  alerts: {
    unsupportedFile: "Tipo de arquivo não suportado. Por favor, selecione um arquivo de imagem ou vídeo.",
    uploadError: "Ocorreu um erro ao fazer upload do arquivo."
  }
};

const ptPT: Translations = {
  actionBar: {
    addNote: "Adicionar Nota",
    addImage: "Adicionar Imagem",
    addVideo: "Adicionar Vídeo",
    toggleVisibility: "Alternar Visibilidade",
    quit: "Sair da Aplicação",
    displays: "Ecrãs",
    screen: "Ecrã",
    primary: "Principal",
    background: "Fundo",
    addBoard: "Nova Tela",
    selectBoard: "Selecionar Tela"
  },
  note: {
    newNote: "Nova Nota"
  },
  fonts: {
    handwritten: "Manuscrita",
    system: "Fonte do Sistema",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Adicionar URL do Vídeo",
    placeholder: "Digite a URL do vídeo",
    supportedSites: "Sites suportados: YouTube, Vimeo, Wistia",
    cancel: "Cancelar",
    submit: "OK"
  },
  boardDialog: {
    title: "Adicionar Nova Tela",
    placeholder: "Digite o nome da tela",
    cancel: "Cancelar",
    submit: "OK"
  },
  boardListDialog: {
    title: "Selecionar Tela",
    close: "Fechar",
    defaultBoard: "Tela padrão",
    searchPlaceholder: "Pesquisar telas..."
  },
  alerts: {
    unsupportedFile: "Tipo de ficheiro não suportado. Selecione um ficheiro de imagem ou vídeo.",
    uploadError: "Ocorreu um erro ao carregar o ficheiro."
  }
};

const vi: Translations = {
  actionBar: {
    addNote: "Thêm Ghi Chú",
    addImage: "Thêm Hình Ảnh",
    addVideo: "Thêm Video",
    toggleVisibility: "Chuyển Đổi Hiển Thị",
    quit: "Thoát Ứng Dụng",
    displays: "Màn Hình",
    screen: "Màn Hình",
    primary: "Chính",
    background: "Nền",
    addBoard: "Bảng Mới",
    selectBoard: "Chọn Bảng"
  },
  note: {
    newNote: "Ghi Chú Mới"
  },
  fonts: {
    handwritten: "Chữ viết tay",
    system: "Font hệ thống",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Thêm URL Video",
    placeholder: "Nhập URL video",
    supportedSites: "Các trang được hỗ trợ: YouTube, Vimeo, Wistia",
    cancel: "Hủy",
    submit: "OK"
  },
  boardDialog: {
    title: "Thêm Bảng Mới",
    placeholder: "Nhập tên bảng",
    cancel: "Hủy",
    submit: "OK"
  },
  boardListDialog: {
    title: "Chọn Bảng",
    close: "Đóng",
    defaultBoard: "Bảng mặc định",
    searchPlaceholder: "Tìm kiếm bảng..."
  },
  alerts: {
    unsupportedFile: "Loại tệp không được hỗ trợ. Vui lòng chọn tệp hình ảnh hoặc video.",
    uploadError: "Đã xảy ra lỗi khi tải tệp lên."
  }
};

const id: Translations = {
  actionBar: {
    addNote: "Tambah Catatan",
    addImage: "Tambah Gambar",
    addVideo: "Tambah Video",
    toggleVisibility: "Alihkan Visibilitas",
    quit: "Keluar Aplikasi",
    displays: "Layar",
    screen: "Layar",
    primary: "Utama",
    background: "Latar",
    addBoard: "Papan Baru",
    selectBoard: "Pilih Papan"
  },
  note: {
    newNote: "Catatan Baru"
  },
  fonts: {
    handwritten: "Tulisan Tangan",
    system: "Font Sistem",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Tambah URL Video",
    placeholder: "Masukkan URL video",
    supportedSites: "Situs yang didukung: YouTube, Vimeo, Wistia",
    cancel: "Batal",
    submit: "OK"
  },
  boardDialog: {
    title: "Tambah Papan Baru",
    placeholder: "Masukkan nama papan",
    cancel: "Batal",
    submit: "OK"
  },
  boardListDialog: {
    title: "Pilih Papan",
    close: "Tutup",
    defaultBoard: "Papan default",
    searchPlaceholder: "Cari papan..."
  },
  alerts: {
    unsupportedFile: "Jenis file tidak didukung. Pilih file gambar atau video.",
    uploadError: "Terjadi kesalahan saat mengunggah file."
  }
};

const pl: Translations = {
  actionBar: {
    addNote: "Dodaj Notatkę",
    addImage: "Dodaj Obraz",
    addVideo: "Dodaj Wideo",
    toggleVisibility: "Przełącz Widoczność",
    quit: "Zamknij Aplikację",
    displays: "Ekrany",
    screen: "Ekran",
    primary: "Główny",
    background: "Tło",
    addBoard: "Nowa Tablica",
    selectBoard: "Wybierz Tablicę"
  },
  note: {
    newNote: "Nowa Notatka"
  },
  fonts: {
    handwritten: "Odręczne",
    system: "Czcionka systemowa",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Dodaj URL Wideo",
    placeholder: "Wprowadź URL wideo",
    supportedSites: "Obsługiwane strony: YouTube, Vimeo, Wistia",
    cancel: "Anuluj",
    submit: "OK"
  },
  boardDialog: {
    title: "Dodaj Nową Tablicę",
    placeholder: "Wprowadź nazwę tablicy",
    cancel: "Anuluj",
    submit: "OK"
  },
  boardListDialog: {
    title: "Wybierz Tablicę",
    close: "Zamknij",
    defaultBoard: "Tablica domyślna",
    searchPlaceholder: "Szukaj tablic..."
  },
  alerts: {
    unsupportedFile: "Nieobsługiwany typ pliku. Wybierz plik obrazu lub wideo.",
    uploadError: "Wystąpił błąd podczas przesyłania pliku."
  }
};

const nl: Translations = {
  actionBar: {
    addNote: "Notitie Toevoegen",
    addImage: "Afbeelding Toevoegen",
    addVideo: "Video Toevoegen",
    toggleVisibility: "Zichtbaarheid Schakelen",
    quit: "Applicatie Afsluiten",
    displays: "Beeldschermen",
    screen: "Scherm",
    primary: "Primair",
    background: "Achtergrond",
    addBoard: "Nieuwe Tafel",
    selectBoard: "Selecteer Tafel"
  },
  note: {
    newNote: "Nieuwe Notitie"
  },
  fonts: {
    handwritten: "Handgeschreven",
    system: "Systeemlettertype",
    terminal: "Terminal"
  },
  videoUrlDialog: {
    title: "Video URL Toevoegen",
    placeholder: "Voer video URL in",
    supportedSites: "Ondersteunde sites: YouTube, Vimeo, Wistia",
    cancel: "Annuleren",
    submit: "OK"
  },
  boardDialog: {
    title: "Nieuwe Tafel Toevoegen",
    placeholder: "Voer de naam van de tafel in",
    cancel: "Annuleren",
    submit: "OK"
  },
  boardListDialog: {
    title: "Selecteer Tafel",
    close: "Sluiten",
    defaultBoard: "Standaard tafel",
    searchPlaceholder: "Zoek tafels..."
  },
  alerts: {
    unsupportedFile: "Niet-ondersteund bestandstype. Selecteer een afbeelding of videobestand.",
    uploadError: "Er is een fout opgetreden bij het uploaden van het bestand."
  }
};

const translations: Record<string, Translations> = {
  tr,
  en,
  fr,
  de,
  es,
  ja,
  zh,
  ru,
  it,
  ko,
  pt,
  vi,
  id,
  pl,
  nl
};

export const useTranslations = () => {
  const [currentTranslations, setCurrentTranslations] = useState<Translations>(en);

  useEffect(() => {
    // İşletim sistemi dilini al
    const osLang = navigator.language.split('-')[0];
    
    // Dil dosyasını seç
    const selectedTranslations = translations[osLang] || en;
    setCurrentTranslations(selectedTranslations);
  }, []);

  return currentTranslations;
}; 