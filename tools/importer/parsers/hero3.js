/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name, exactly as in the example
  const headerRow = ['Hero (hero3)'];

  // 2. Second row: background image (none in this HTML)
  const backgroundRow = [''];

  // 3. Third row: all text content from this block (preserving headings, formatting, and order)
  // Strategy: get all <p>, <h1>-<h6>, <ul>, <ol> and <a> in DOM order, direct or nested
  // Put all found elements (referenced, not cloned) into the cell in DOM order
  // We'll use a tree walker to ensure we keep top-level text structure (not deeply nested or duplicated)

  // Function to collect desired content elements in order
  function collectHeroContent(parent) {
    const tags = ['H1','H2','H3','H4','H5','H6','P','UL','OL'];
    const res = [];
    for (const child of parent.children) {
      if (tags.includes(child.tagName)) {
        res.push(child);
      } else {
        // recurse into children
        res.push(...collectHeroContent(child));
      }
    }
    return res;
  }

  // The source only uses <p>, so let's start with all <p> elements in DOM order
  let contentEls = collectHeroContent(element);
  // If nothing found, fallback to all <p> in block
  if (contentEls.length === 0) {
    contentEls = Array.from(element.querySelectorAll('p'));
  }

  // Remove empty elements
  contentEls = contentEls.filter(e => e.textContent && e.textContent.trim());
  // If still nothing, fallback to any non-empty text nodes
  if (contentEls.length === 0) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) { return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
    });
    const texts = [];
    let node;
    while(node = walker.nextNode()) {
      texts.push(document.createTextNode(node.textContent.trim()));
    }
    if (texts.length) {
      contentEls = texts;
    }
  }

  // If still nothing, provide a blank string
  if (contentEls.length === 0) {
    contentEls = [''];
  }
  // Compose the table
  const rows = [
    headerRow,
    backgroundRow,
    [contentEls]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
