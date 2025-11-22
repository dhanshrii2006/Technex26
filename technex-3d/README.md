# 🌌 Technex 2026 - 3D Space Experience

An ultra-realistic, immersive 3D space background built with React Three Fiber. Features scientifically accurate starfields, cosmic dust nebulae, and smooth mouse-controlled 3D navigation.

## ✨ Features

- **🌟 25,000+ Realistic Stars** - Scientifically accurate stellar classification with proper colors
- **🎮 Mouse-Responsive 3D Controls** - Full 360° rotation, zoom, and pan
- **🌫️ Cosmic Dust Nebulae** - Procedural reflection and dark nebulae
- **⭐ Atmospheric Scintillation** - Realistic star twinkling effects  
- **🎯 Parallax Depth** - Multi-layered objects for immersive 3D experience
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (version 16.0 or higher)
- **npm** (comes with Node.js)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhanshrii2006/Technex26.git
   cd Technex26/technex-3d
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

   🎉 **You should now see the immersive 3D space experience!**

## 🎮 Controls

- **Mouse Drag** - Rotate and look around in 3D space
- **Mouse Wheel** - Zoom in and out
- **Right Click + Drag** - Pan the view

## 🛠️ Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm run build`
Creates an optimized production build in the `build` folder.

### `npm test`
Launches the test runner (if tests are added).

## 🎨 Tech Stack

- **React 19.2.0** - Frontend framework
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber

## 📁 Project Structure

```
technex-3d/
├── src/
│   ├── App.js              # Main app component
│   ├── SpaceBackground.js  # 3D space scene
│   ├── App.css            # Minimal styles
│   ├── index.css          # Global styles
│   └── index.js           # Entry point
├── public/
│   ├── index.html         # HTML template
│   └── manifest.json      # PWA manifest
└── package.json           # Dependencies & scripts
```

## 🌟 Performance

- Optimized for **60 FPS** rendering
- **25,000+ stars** with efficient GPU rendering
- Adaptive pixel ratio for different devices
- Memory-efficient reused geometries

## 🔧 Customization

The space scene can be customized in `src/SpaceBackground.js`:
- Adjust star count in `RealisticStarfield`
- Modify nebula positions and types
- Change camera settings and controls
- Add new 3D objects or effects

## 🚀 Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to any static hosting service:
   - Vercel
   - Netlify  
   - GitHub Pages
   - Firebase Hosting

## 📄 License

This project is part of Technex 2026 event.

---

**Made with ❤️ for Technex 2026**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
