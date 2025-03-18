# Bordi - Sanal Pano Uygulaması | Virtual Board Application

[English](#english) | [Türkçe](#türkçe)

# Türkçe

Bordi, masaüstünüzü interaktif bir çalışma alanına dönüştüren, şeffaf ve modern bir sanal pano uygulamasıdır. Electron ve React teknolojileri ile geliştirilmiş bu uygulama, notlarınızı ve medya dosyalarınızı özgürce düzenlemenize olanak tanır.

## 🌟 Özellikler

### 📝 Not ve Medya Yönetimi
- Notlar oluşturma ve düzenleme
- Fotoğraf ve video ekleme
- Sürükle-bırak ile kolay düzenleme
- Rastgele ve eğimli yerleşim

### 🎯 Etkileşim
- Tam şeffaf arka plan
- Masaüstü ve diğer uygulamalarla etkileşim
- Akıllı fare olayları yönetimi
- Sürükle-bırak desteği

### 📌 Raptiye ve Bağlantı Sistemi
- Bileşenlere raptiye ekleme
- Raptiyeler arası bağlantılar
- Gerçekçi ip animasyonları ve etkileşimleri

### 🎨 Görsel Özellikler
- Modern ve minimal tasarım
- Özelleştirilebilir not renkleri
- Şık medya çerçeveleri
- Yumuşak animasyonlar

## 🚀 Başlangıç

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn
- Git

### Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/kemalersin/bordi.git
cd bordi
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Geliştirme modunda çalıştırın:
```bash
npm run electron:dev
# veya
yarn electron:dev
```

4. Uygulamayı derleyin:
```bash
npm run electron:build
# veya
yarn electron:build
```

5. Uygulamayı yayınlayın:
```bash
npm run dist:win:appx
```

## 🛠️ Teknolojiler

- **Electron**: Masaüstü uygulama çerçevesi
- **React**: UI geliştirme kütüphanesi
- **TypeScript**: Tip güvenli JavaScript
- **Styled Components**: CSS-in-JS çözümü
- **Vite**: Build aracı

## 📦 Proje Yapısı

```
bordi/
├── src/
│   ├── components/     # React bileşenleri
│   ├── styles/        # Stil dosyaları
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript tip tanımları
│   ├── constants/     # Sabit değerler
│   └── utils/         # Yardımcı fonksiyonlar
├── electron/          # Electron ana süreç
└── public/           # Statik dosyalar
```

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- Ve diğer tüm açık kaynak projelere

---

Geliştirici: [Kemal Ersin](https://github.com/kemalersin)

---

# English

Bordi is a transparent and modern virtual board application that transforms your desktop into an interactive workspace. Developed with Electron and React technologies, this application allows you to freely organize your notes and media files.

## 🌟 Features

### 📝 Note and Media Management
- Create and edit notes
- Add photos and videos
- Easy drag-and-drop editing
- Random and tilted placement

### 🎯 Interaction
- Fully transparent background
- Interact with desktop and other applications
- Smart mouse event handling
- Drag-and-drop support

### 📌 Pin and Connection System
- Add pins to components
- Create connections between pins
- Realistic rope animations and interactions

### 🎨 Visual Features
- Modern and minimal design
- Customizable note colors
- Elegant media frames
- Smooth animations

## 🚀 Getting Started

### Requirements
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kemalersin/bordi.git
cd bordi
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run in development mode:
```bash
npm run electron:dev
# or
yarn electron:dev
```

4. Build the application:
```bash
npm run electron:build
# or
yarn electron:build
```

## 🛠️ Technologies

- **Electron**: Desktop application framework
- **React**: UI development library
- **TypeScript**: Type-safe JavaScript
- **Styled Components**: CSS-in-JS solution
- **Vite**: Build tool

## 📦 Project Structure

```
bordi/
├── src/
│   ├── components/     # React components
│   ├── styles/        # Style files
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   ├── constants/     # Constants
│   └── utils/         # Helper functions
├── electron/          # Electron main process
└── public/           # Static files
```

## 🤝 Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- And all other open source projects

---

Developer: [Kemal Ersin](https://github.com/kemalersin)
