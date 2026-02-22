

## Fix Quran Reader PDF Loading

The app is already built and matches the GitHub repo. The only issue is that the PDF fails to load in the web preview because the code uses `Capacitor.convertFileSrc("Quraan.pdf")`, which only works in native Android builds.

### What will change

**File: `src/pages/Index.tsx`**

Update the PDF URL logic to detect whether the app is running on the web or in a native Capacitor environment:
- On the **web**: use `/Quraan.pdf` (served from the `public/` folder)
- On a **native device** (Capacitor): keep using `Capacitor.convertFileSrc()`

This is a one-line fix in the `useEffect` that sets the PDF URL.

### Technical Details

In `src/pages/Index.tsx`, the `useEffect` around line 24 currently does:
```typescript
const localUrl = Capacitor.convertFileSrc("Quraan.pdf");
setPdfUrl(localUrl);
```

This will be changed to:
```typescript
const isNative = Capacitor.isNativePlatform();
const localUrl = isNative
  ? Capacitor.convertFileSrc("Quraan.pdf")
  : "/Quraan.pdf";
setPdfUrl(localUrl);
```

No other files need to change. The rest of the app (header, bookmarks, sidebar, page navigation, immersive mode) is all working correctly.

