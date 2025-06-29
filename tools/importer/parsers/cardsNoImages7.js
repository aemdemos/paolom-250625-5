/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract title and description for each card
  function extractCardContent(contentRoot) {
    // Title: look for .css-88py30 > p in the card content root
    let titleP = contentRoot.querySelector('.css-88py30 p');
    // Description: look for .css-59rdls > p in the card content root
    let descrP = contentRoot.querySelector('.css-59rdls p');
    // Compose cell contents, referencing existing elements (not cloning)
    const contents = [];
    if (titleP) {
      // Use <strong> to match markdown bold for card titles
      const strong = document.createElement('strong');
      strong.append(titleP.textContent);
      contents.push(strong);
    }
    if (descrP) {
      // Add a <br> if title is present
      if (titleP) {
        contents.push(document.createElement('br'));
      }
      contents.push(descrP);
    }
    return contents;
  }

  // Find all direct card containers (not the first wrapper)
  // Each card is a direct child div.css-5knerd.css-v27th6
  const cardDivs = Array.from(element.querySelectorAll(':scope > .css-5knerd.css-v27th6'));
  const rows = [];
  // Add header row exactly as in the example
  rows.push(['Cards']);
  // For each card, extract its content
  cardDivs.forEach(cardDiv => {
    // In each card, find the main content root
    // This is typically the div with class .css-l15ofz or .css-33ubei (they contain both title and desc)
    let contentRoot = cardDiv.querySelector('.css-l15ofz, .css-33ubei');
    if (!contentRoot) {
      // Alternate structure: sometimes there's an extra wrapper, so search deeper
      contentRoot = cardDiv.querySelector('.css-5knerd .css-l15ofz, .css-5knerd .css-33ubei');
    }
    if (contentRoot) {
      const cellContent = extractCardContent(contentRoot);
      if (cellContent.length > 0) {
        rows.push([cellContent]);
      }
    }
  });

  // Only create the table if there is at least one card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
