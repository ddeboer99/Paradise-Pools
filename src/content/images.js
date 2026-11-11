import images from '../data/images.json' with { type: 'json' };

const defaultSizes = '(max-width: 620px) 86vw, (max-width: 900px) 88vw, 44vw';
const sourceSet = image => image.sources.map(source => `${source.src} ${source.width}w`).join(', ');

// Apply only to our trusted build-time templates. Source URLs remain in the
// content files so future edits and image provenance stay easy to trace.
export function localizeImages(html) {
  html = html.replace(/<img\b[^>]*>/g, tag => {
    const source = tag.match(/\bsrc="([^"]+)"/)?.[1];
    const image = images[source];
    if (!image) return tag;
    const sizes = tag.includes('alt=""') ? '84px' : tag.includes('faq-product-image') ? '260px' : tag.includes('gallery-photo') ? '(max-width: 620px) 86vw, (max-width: 900px) 42vw, 27vw' : defaultSizes;
    return tag.replace(/\bsrc="[^"]+"/, `src="${image.src}"`)
      .replace(/\s*\/?\s*>$/, ` width="${image.width}" height="${image.height}" srcset="${sourceSet(image)}" sizes="${sizes}" decoding="async">`);
  });
  // Keep alternate gallery images responsive after a thumbnail is selected.
  html = html.replace(/data-src="([^"]+)"/g, (attribute, source) => {
    const image = images[source];
    return image ? `data-src="${image.src}" data-srcset="${sourceSet(image)}" data-width="${image.width}" data-height="${image.height}"` : attribute;
  });
  html = html.replace(/(--(?:hero|offering)-image):url\('([^']+)'\)/g, (attribute, name, source) => {
    const image = images[source];
    if (!image) return attribute;
    const mobile = image.sources.find(variant => variant.width >= 960) || image.sources.at(-1);
    return `${name}:url('${image.src}');${name}-mobile:url('${mobile.src}')`;
  });
  return html;
}
