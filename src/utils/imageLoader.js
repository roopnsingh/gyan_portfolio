/**
 * Gallery images from /public/images/ via manifest.json.
 * After adding photos, run: npm run images:manifest
 */

const WEB_IMAGE_PATTERN = /\.(jpe?g|png|webp|avif)$/i

export const PROFILE_IMAGE = '/images/profile.PNG'
export const PROFILE_FALLBACK = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80'

const PROFILE_BASENAMES = new Set(['profile', 'profile.png', 'profile.jpg', 'profile.jpeg', 'profile.webp'])

export function isProfileImage(filename) {
  return PROFILE_BASENAMES.has(filename.toLowerCase())
}

function toImageEntry(filename, index) {
  const src = `/images/${filename}`
  return {
    id: index + 1,
    src,
    srcFull: src,
    alt: `Photography work ${index + 1}`,
  }
}

function generatePlaceholderImages(count) {
  const unsplashIds = [
    'photo-1506905925346-21bda4d32df4',
    'photo-1500534314209-a25ddb2bd429',
    'photo-1441974231531-c6227db76b6e',
    'photo-1518173946687-a4c8892bbd9f',
    'photo-1469474968028-56623f02e42e',
    'photo-1447752875215-b2761acb3c5d',
    'photo-1475924156734-496f6cac6ec1',
    'photo-1490806843957-31f4c9a91c65',
    'photo-1501854140801-50d01698950b',
    'photo-1504701954957-2010ec3bcec1',
    'photo-1511300636408-a63a89df3482',
    'photo-1518020382113-a7e8fc38eac9',
  ]

  return unsplashIds.slice(0, count).map((id, index) => ({
    id: index + 1,
    src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`,
    srcFull: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=90`,
    alt: `Photography work ${index + 1}`,
  }))
}

/** Load gallery images from /public/images/manifest.json (browser-safe formats only). */
export async function loadGalleryImages() {
  try {
    const res = await fetch('/images/manifest.json', { cache: 'no-store' })
    if (!res.ok) throw new Error(`manifest ${res.status}`)

    const data = await res.json()
    const files = (data.images ?? []).filter((f) => WEB_IMAGE_PATTERN.test(f))

    if (files.length === 0) {
      return generatePlaceholderImages(12)
    }

    return files.map(toImageEntry)
  } catch {
    return generatePlaceholderImages(12)
  }
}
