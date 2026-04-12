"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./index.module.scss";

const IMAGES = Array.from({ length: 21 }, (_, i) => ({
  src: `/media/food-${i + 1}.webp`,
  alt: `Galerij afbeelding ${i + 1}`,
}));

export function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const total = IMAGES.length;

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  // Auto-advance every 4 s, pause on hover / focus
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next]);

  // Keyboard navigation when the region is focused
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
        case "ArrowRight":
          e.preventDefault();
          next();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(total - 1);
          break;
      }
    },
    [prev, next, goTo, total],
  );

  // Touch / swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
    }
    setTouchStart(null);
  };

  return (
    <div
      ref={regionRef}
      className={styles.carousel}
      role="region"
      aria-label="Galerij diavoorstelling"
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Slide track ── */}
      <div
        className={styles.carouselTrack}
        aria-live="polite"
        aria-atomic="true"
      >
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            className={styles.carouselSlide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} van ${total}`}
            aria-hidden={i !== current}
            data-active={i === current}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 72rem"
              className={styles.carouselImage}
              priority={i === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* ── Gradient overlays for legibility ── */}
      <div className={styles.carouselOverlayLeft} aria-hidden="true" />
      <div className={styles.carouselOverlayRight} aria-hidden="true" />
      <div className={styles.carouselOverlayBottom} aria-hidden="true" />

      {/* ── Prev button ── */}
      <button
        type="button"
        className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`}
        onClick={prev}
        aria-label="Vorige afbeelding"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* ── Next button ── */}
      <button
        type="button"
        className={`${styles.carouselBtn} ${styles.carouselBtnNext}`}
        onClick={next}
        aria-label="Volgende afbeelding"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Dot indicators (mobile only) ── */}
      <div
        className={styles.carouselDots}
        role="tablist"
        aria-label="Selecteer afbeelding"
      >
        {IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            className={styles.carouselDot}
            aria-selected={i === current}
            aria-label={`Afbeelding ${i + 1} van ${total}`}
            onClick={() => goTo(i)}
            data-active={i === current}
          />
        ))}
      </div>

      {/* ── Thumbnail strip (desktop, visible on carousel hover) ── */}
      <div
        className={styles.carouselThumbs}
        role="tablist"
        aria-label="Selecteer afbeelding"
      >
        {IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            className={styles.carouselThumb}
            aria-selected={i === current}
            aria-label={`Afbeelding ${i + 1} van ${total}`}
            onClick={() => goTo(i)}
            data-active={i === current}
          >
            <Image
              src={img.src}
              alt=""
              fill
              sizes="80px"
              className={styles.carouselThumbImage}
              tabIndex={-1}
            />
          </button>
        ))}
      </div>

      {/* ── Counter badge ── */}
      <div
        className={styles.carouselCounter}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Afbeelding ${current + 1} van ${total}`}
      >
        {current + 1} <span aria-hidden="true">/</span> {total}
      </div>
    </div>
  );
}

