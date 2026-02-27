# 🎨 Spline 3D Integration with Next.js 15

Interactive 3D scenes powered by Spline, React, Next.js 15, and shadcn/ui.

## 🚀 Features

- ✅ **Next.js 15** (App Router) with TypeScript
- ✅ **Tailwind CSS** for styling
- ✅ **shadcn/ui** components
- ✅ **Spline 3D** integration with lazy loading
- ✅ **Framer Motion** for smooth animations
- ✅ **Spotlight effects** (Aceternity + ibelick variants)
- ✅ **Responsive design**

## 📁 Project Structure

```
spline-3d-project/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles + spotlight animation
│   │   └── page.tsx             # Main demo page
│   ├── components/
│   │   └── ui/
│   │       ├── card.tsx         # shadcn Card component
│   │       ├── splite.tsx       # Spline 3D scene loader
│   │       ├── spotlight.tsx    # Static spotlight (Aceternity)
│   │       ├── spotlight-interactive.tsx  # Interactive spotlight (ibelick)
│   │       └── demo.tsx         # Demo component
│   └── lib/
│       └── utils.ts             # Utility functions
├── package.json
└── components.json              # shadcn/ui configuration
```

## 🎯 Components Overview

### 1. **SplineScene** (`splite.tsx`)
Main component for loading 3D Spline scenes with Suspense and lazy loading.

```tsx
import { SplineScene } from "@/components/ui/splite"

<SplineScene 
  scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode"
  className="w-full h-full"
/>
```

### 2. **Spotlight** (`spotlight.tsx`)
Static spotlight effect from Aceternity UI.

```tsx
import { Spotlight } from "@/components/ui/spotlight"

<Spotlight
  className="-top-40 left-0 md:left-60 md:-top-20"
  fill="white"
/>
```

### 3. **SpotlightInteractive** (`spotlight-interactive.tsx`)
Interactive spotlight that follows the mouse cursor.

```tsx
import { SpotlightInteractive } from "@/components/ui/spotlight-interactive"

<SpotlightInteractive 
  size={300}
  className="my-custom-class"
/>
```

### 4. **Card** (`card.tsx`)
shadcn/ui Card component for layout.

## 🛠️ Development

### Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Test Interactive Spotlight
Visit the test page to verify the cursor-following spotlight effect:
```
http://localhost:3000/test
```

This page shows three different spotlight variations:
- **Blue-Purple-Pink** gradient (400px)
- **Green-Emerald-Teal** gradient (500px, larger)
- **Orange-Red-Pink** gradient (350px, higher opacity)

Move your cursor over each card to see the interactive spotlight effect in action.

### Build for Production
```bash
npm run build
npm start
```

## 📦 Dependencies

### Core
- `next` - Next.js 15 framework
- `react` - React 19
- `typescript` - Type safety

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `@radix-ui/*` - Headless UI components (via shadcn)
- `class-variance-authority` - CSS utility
- `clsx` - Class names utility
- `tailwind-merge` - Merge Tailwind classes

### 3D & Animation
- `@splinetool/runtime` - Spline runtime
- `@splinetool/react-spline` - React bindings for Spline
- `framer-motion` - Animation library

## 🎨 Customization

### Change Spline Scene
Edit the scene URL in `src/components/ui/demo.tsx`:

```tsx
<SplineScene 
  scene="https://prod.spline.design/YOUR_NEW_SCENE_ID/scene.splinecode"
  className="w-full h-full"
/>
```

### Add New Spline Scenes
1. Create your scene at [spline.design](https://spline.design)
2. Export and get the scene URL
3. Use the `SplineScene` component anywhere in your app

### Modify Colors
Update color scheme in `src/app/globals.css`:

```css
:root {
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  /* ... more colors */
}
```

### Adjust Spotlight Animation
Modify animation in `src/app/globals.css`:

```css
@keyframes spotlight {
  0% {
    opacity: 0;
    transform: translate(-72%, -62%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -40%) scale(1);
  }
}
```

## 📝 Usage Examples

### Example 1: Full-Width Hero Section
```tsx
import { SplineScene } from "@/components/ui/splite"

export function Hero() {
  return (
    <div className="h-screen relative">
      <SplineScene 
        scene="YOUR_SCENE_URL"
        className="w-full h-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">
          Welcome to 3D
        </h1>
      </div>
    </div>
  )
}
```

### Example 2: Split Layout with Content
```tsx
import { SplineScene } from "@/components/ui/splite"
import { Card } from "@/components/ui/card"

export function Feature() {
  return (
    <Card className="grid md:grid-cols-2 gap-8 p-8">
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-bold">Interactive 3D</h2>
        <p className="mt-4 text-muted-foreground">
          Engage users with immersive experiences
        </p>
      </div>
      <div className="h-96">
        <SplineScene 
          scene="YOUR_SCENE_URL"
          className="w-full h-full"
        />
      </div>
    </Card>
  )
}
```

### Example 3: With Interactive Spotlight
```tsx
import { SplineScene } from "@/components/ui/splite"
import { SpotlightInteractive } from "@/components/ui/spotlight-interactive"

export function InteractiveCard() {
  return (
    <div className="relative">
      <SpotlightInteractive size={400} />
      <div className="h-96 relative z-10">
        <SplineScene 
          scene="YOUR_SCENE_URL"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
```

## 🔧 Troubleshooting

### Scene not loading
- Check that the Spline scene URL is correct
- Verify internet connection (scenes load from CDN)
- Check browser console for errors

### Slow loading
- Spline scenes can be large. Consider:
  - Optimizing your scene in Spline editor
  - Using smaller models/textures
  - Adding loading states

### Spotlight animation not working
- Ensure `globals.css` includes the `@keyframes spotlight` definition
- Check that Tailwind CSS is properly configured
- Verify the `animate-spotlight` class is applied

## 📚 Resources

- [Spline Documentation](https://docs.spline.design)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com)

## 🎓 Learn More

### Spline Integration
- [Spline React Integration Guide](https://docs.spline.design/8bc268c344574acba0e895d43f1a73cd)
- [Optimizing Spline Scenes](https://docs.spline.design/optimization)

### Performance
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Lazy Loading](https://react.dev/reference/react/lazy)

## 📄 License

MIT

## 🙏 Credits

- **Spline** - 3D design tool
- **shadcn** - UI component library
- **Aceternity UI** - Spotlight effect
- **ibelick** - Interactive spotlight
- **Vercel** - Next.js framework

---

Built with ❤️ using Next.js 15, React, and Spline
