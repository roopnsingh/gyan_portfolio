#!/usr/bin/env node
/**
 * generate-manifest.js
 * 
 * Run this script whenever you add new photos to /public/images/
 * It scans the folder and creates /public/images/manifest.json
 * 
 * Usage:
 *   node scripts/generate-manifest.js
 * 
 * Then update src/utils/imageLoader.js to use the manifest (see instructions there).
 */

import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { join, extname, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = join(__dirname, '..', 'public', 'images')
const MANIFEST_PATH = join(IMAGES_DIR, 'manifest.json')

// Formats that work in <img> tags in Chrome, Firefox, and Safari
const GALLERY_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const PROFILE_PATTERN = /^profile\.(jpg|jpeg|png|webp|avif|heif|heic)$/i

/** On macOS, convert HEIC/HEIF to JPG so they work in all browsers. */
function convertHeicToJpg() {
  if (process.platform !== 'darwin') return

  const heicFiles = readdirSync(IMAGES_DIR).filter((f) => /\.(heic|heif)$/i.test(f))
  for (const heic of heicFiles) {
    const jpgName = `${basename(heic, extname(heic))}.jpg`
    const jpgPath = join(IMAGES_DIR, jpgName)
    if (existsSync(jpgPath)) continue

    try {
      execSync(`sips -s format jpeg "${join(IMAGES_DIR, heic)}" --out "${jpgPath}"`, { stdio: 'pipe' })
      console.log(`🔄 Converted ${heic} → ${jpgName}`)
    } catch (err) {
      console.warn(`⚠️  Could not convert ${heic}:`, err.message)
    }
  }
}

function generateManifest() {
  if (!existsSync(IMAGES_DIR)) {
    mkdirSync(IMAGES_DIR, { recursive: true })
    console.log('✅ Created /public/images/ directory')
  }

  convertHeicToJpg()

  const allImages = readdirSync(IMAGES_DIR).filter(file => {
    const ext = extname(file).toLowerCase()
    const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heif', '.heic'].includes(ext)
    return isImage && !file.startsWith('.') && !PROFILE_PATTERN.test(file)
  })

  const files = allImages.filter(file => GALLERY_EXTENSIONS.has(extname(file).toLowerCase()))
  const skipped = allImages.filter(file => !GALLERY_EXTENSIONS.has(extname(file).toLowerCase()))

  // Sort naturally (1.jpg, 2.jpg, 10.jpg, etc.)
  files.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0')
    const numB = parseInt(b.match(/\d+/)?.[0] || '0')
    return numA - numB || a.localeCompare(b)
  })

  const manifest = {
    generated: new Date().toISOString(),
    count: files.length,
    images: files,
    skipped: skipped.length > 0 ? skipped : undefined,
  }

  const json = JSON.stringify(manifest, null, 2)
  writeFileSync(MANIFEST_PATH, json)
  console.log(`✅ Manifest generated: ${files.length} gallery images`)
  console.log(`📁 Saved to: ${MANIFEST_PATH}`)
  files.forEach((f, i) => console.log(`   ${i + 1}. ${f}`))
  if (skipped.length > 0) {
    console.log(`⚠️  Skipped ${skipped.length} file(s) — convert HEIC/HEIF to JPG for the gallery:`)
    skipped.forEach((f) => console.log(`   - ${f}`))
  }
}

generateManifest()
