/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero9)'];

  // 2. Get background image: first <img> descendant
  let bgImg = element.querySelector('img');

  // 3. Get the text content block (headline, subheading, etc.)
  //  - Look for the first child with class 'textContents', or fallback to first <p>, <h1>, <h2>, etc.
  let textContents = null;
  const textDiv = element.querySelector('.textContents');
  if (textDiv && textDiv.childNodes.length > 0) {
    // If it's hidden, set visible so content is extractable
    textDiv.style.opacity = 1;
    textDiv.style.display = '';
    textContents = textDiv;
  } else {
    // fallback: create a div with all direct children that are p/h1/h2/h3/h4/h5/h6
    const children = Array.from(element.querySelectorAll(':scope > *'));
    const textEls = children.filter(el => /^H[1-6]$/.test(el.tagName) || el.tagName === 'P');
    if (textEls.length > 0) {
      textContents = document.createElement('div');
      textEls.forEach(el => textContents.appendChild(el));
    }
  }

  // 4. Build table rows: Only include rows for actual content
  const rows = [headerRow];
  rows.push([bgImg ? bgImg : '']);
  rows.push([textContents ? textContents : '']);

  // 5. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element
  element.replaceWith(table);
}
