# Images Directory

Drop your photos here. Supported formats:
- .jpg / .jpeg
- .png  
- .webp
- .avif
- .heif / .heic

## Simple naming convention
Name your files sequentially for best results:
```
1.jpg
2.jpg
3.webp
4.png
...
```

## Auto-discovery
Run `npm run images:manifest` to scan this folder and update the gallery.
HEIC/HEIF files are auto-converted to JPG on Mac so all photos work in the browser.

## Quick switch (no manifest needed)
If you prefer Vite's built-in bundling, move your images to:
`src/assets/images/`
And update imageLoader.js to use the glob import method described there.
