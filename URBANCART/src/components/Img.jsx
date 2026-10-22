import React from 'react';
import { FALLBACK } from '../data/utils.js';

/* Image with lazy loading and a fallback so broken-image icons never show */
export default function Img(props) {
  return <img loading="lazy" {...props} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }} />;
}
