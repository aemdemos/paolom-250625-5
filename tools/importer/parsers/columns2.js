/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns as direct children of the inner container div
  let containerDiv = element.querySelector(':scope > div');
  let columns = [];
  if (containerDiv) {
    columns = Array.from(containerDiv.querySelectorAll(':scope > div'));
  } else {
    columns = Array.from(element.querySelectorAll(':scope > div'));
  }

  // Fix: Header row must have same number of columns as content
  const headerRow = ['Columns (columns2)', ...Array(Math.max(0, columns.length - 1)).fill('')];
  const cellsRow = columns.map((col) => col);

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellsRow,
  ], document);
  element.replaceWith(table);
}
