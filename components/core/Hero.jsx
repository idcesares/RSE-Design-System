'use client';
import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Hero.css. Buttons arrive as children; media is a node the caller passes
// (an <image-slot>). Hero never renders an image of its own.
export const Hero = React.forwardRef(function Hero({ tone = 'page', eyebrow, title, lead, badge, media, mediaPosition = 'end', as = 'h1', children, className, ...rest }, ref) {
  const titleId = React.useId();
  const meta = eyebrow || badge
    ? React.createElement('div', { className: 'rse-hero__meta' },
      eyebrow ? React.createElement('p', { className: 'rse-hero__eyebrow' }, eyebrow) : null,
      badge || null)
    : null;
  return React.createElement('section', { ref, 'aria-labelledby': titleId, className: cx('rse-hero', tone !== 'page' && 'rse-hero--' + tone, !media && 'rse-hero--no-media', media && mediaPosition === 'start' && 'rse-hero--media-start', className), ...rest },
    React.createElement('div', { className: 'rse-hero__inner' },
      React.createElement('div', { className: 'rse-hero__content' },
        meta,
        React.createElement(as, { id: titleId, className: 'rse-hero__title' }, title),
        lead ? React.createElement('p', { className: 'rse-hero__lead' }, lead) : null,
        children ? React.createElement('div', { className: 'rse-hero__actions' }, children) : null
      ),
      media ? React.createElement('div', { className: 'rse-hero__media' }, media) : null
    )
  );
});
