# Magic Type Cube

An interactive 3D cube that reveals timeless PHP wisdom for static analysis. Spin the cube to discover best practices for writing type-safe, maintainable PHP code.

## Live Demo

🎲 [Try it live](https://voku.github.io/MagicTypeCube/)

## Features

- **Interactive 3D Cube**: Drag to rotate, click to spin
- **Six Wisdom Faces**: Each face contains a different static analysis best practice
- **Smooth Animations**: Beautiful transitions and physics-based interactions
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, gradient-based design with subtle visual effects

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Visit `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Visit the project repository: [https://github.com/voku/MagicTypeCube](https://github.com/voku/MagicTypeCube)

## Technologies

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## Key Files Detector Helper Prompt

When working with this codebase, here are the key files to understand:

- `App.tsx` - Main application component with cube rotation logic
- `components/Cube.tsx` - 3D cube rendering component
- `components/WisdomDisplay.tsx` - Displays the wisdom content for each face
- `components/Icon.tsx` - Icon wrapper component
- `constants.ts` - Contains all wisdom data for the six cube faces
- `types.ts` - TypeScript type definitions
- `index.html` - HTML entry point with styling
- `vite.config.ts` - Vite configuration

## License

MIT
