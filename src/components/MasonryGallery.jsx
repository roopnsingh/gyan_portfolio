import { useState } from 'react'

function MasonryItem({ image, onOpen }) {
  const [failed, setFailed] = useState(false)

  return (
    <button
      type="button"
      className="masonry-item cursor-none"
      onClick={onOpen}
      aria-label={`View ${image.alt}`}
    >
      {failed ? (
        <span className="masonry-item-fallback" aria-hidden />
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
    </button>
  )
}

export default function MasonryGallery({ images, onOpen }) {
  if (images.length === 0) return null

  return (
    <div className="masonry-gallery" role="list">
      {images.map((image, index) => (
        <MasonryItem
          key={image.src}
          image={image}
          onOpen={() => onOpen(index)}
        />
      ))}
    </div>
  )
}
