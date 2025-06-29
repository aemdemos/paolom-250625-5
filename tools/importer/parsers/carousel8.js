/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as in the example
  const cells = [['Carousel (carousel8)']];

  // No image in this HTML, so first cell is empty
  // Second cell: text and CTA
  // Extract headline (the left text)
  let headline = '';
  const headlineDiv = element.querySelector('.textContents');
  if (headlineDiv) {
    headline = headlineDiv;
  }

  // Extract CTA (the button on the right)
  let cta = '';
  const ctaDiv = element.querySelector('[tabindex][role="link"]');
  if (ctaDiv) {
    cta = ctaDiv;
  }

  // Compose a single cell with headline and CTA
  const textCtaCell = document.createElement('div');
  if (headline) textCtaCell.appendChild(headline);
  if (cta) textCtaCell.appendChild(cta);

  cells.push(['', textCtaCell]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
