/* global WebImporter */
export default function parse(element, { document }) {
  // Header row - must match example exactly
  const headerRow = ['Hero (hero6)'];

  // Second row: background image (if any)
  // Look for the first <img> in the element (background image)
  const img = element.querySelector('img');
  const imageRow = [img ? img : ''];

  // Third row: text content (title, subtitle, cta, etc)
  // The content is inside a div with class 'textContents', but may be missing or swapped
  let contentCell;
  // Try to collect all text/heading content inside the block for resilience
  const textContent = [];
  // Find all elements that may have title/subtitle/CTA
  const possibleTextWrappers = element.querySelectorAll('.textContents, .css-8zr56v, p, h1, h2, h3, h4, h5, h6');
  possibleTextWrappers.forEach(el => {
    // Only add direct children with text (not empty)
    if (el && el.textContent && el.textContent.trim().length > 0) {
      textContent.push(el);
    }
  });
  if (textContent.length > 0) {
    contentCell = textContent;
  } else {
    // fallback: any paragraph in case structure changes
    const fallback = element.querySelector('p');
    contentCell = fallback ? [fallback] : [''];
  }
  const contentRow = [contentCell];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
