import React from 'react';
import { fallbackImg } from '../data/utils.js';

/* Image with lazy loading and a fallback so broken-image icons never show */
export default function Img(props) {
  return <img loading="lazy" {...props} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImg(props.alt); }} />;
}
