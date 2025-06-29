/* global WebImporter */
export default function parse(element, { document }) {
  // The block name header must match exactly
  const headerRow = ['Embed'];

  // The content row should contain all text content (headings and paragraphs) from the given element
  // Since there is no embed link or image, just present the combined inner elements in the cell

  // Get all direct 'textContents' children and collect their children (paragraphs, etc)
  const content = [];
  element.querySelectorAll(':scope .textContents').forEach(tc => {
    // For each .textContents, append all child nodes (preserves <p> and formatting)
    Array.from(tc.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.TEXT_NODE) {
        content.push(child);
      }
    });
  });

  // As a fallback, if content is empty, use the whole element
  const cellContent = content.length ? content : [element];

  const cells = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
