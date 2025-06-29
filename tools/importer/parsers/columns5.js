/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell
  const headerRow = ['Columns (columns5)'];

  // Find the grouping for the columns
  let columnsRoot = element.querySelector(':scope > .css-tgy8lu.css-7js8wp');
  if (!columnsRoot) {
    columnsRoot = element;
  }

  // Each column is a .css-5knerd direct child of columnsRoot (skip first if it's a wrapper)
  let columnWrappers = Array.from(columnsRoot.children).filter(child => child.classList.contains('css-5knerd'));
  // fallback: if nothing found and columnsRoot is itself .css-5knerd
  if (columnWrappers.length === 0 && columnsRoot.classList.contains('css-5knerd')) {
    columnWrappers = [columnsRoot];
  }

  // For each wrapper, find their .css-gv4dl4 child
  const columns = columnWrappers.map(wrapper => {
    let col = wrapper.querySelector(':scope > .css-gv4dl4');
    return col || wrapper;
  });

  // Edge fallback: if we didn't find columns, try all .css-gv4dl4 in columnsRoot
  let cols = columns.filter(Boolean);
  if (cols.length === 0) {
    cols = Array.from(columnsRoot.querySelectorAll(':scope > .css-gv4dl4'));
  }
  if (cols.length === 0) {
    // fallback: use direct children of columnsRoot
    cols = Array.from(columnsRoot.children);
  }

  // Collect content for each column
  const contentRow = cols.map(col => {
    // Content blocks are .textContents children, or all direct children if none
    const blocks = Array.from(col.querySelectorAll(':scope > .textContents'));
    if (blocks.length > 0) {
      return blocks.length === 1 ? blocks[0] : blocks;
    }
    // fallback: all direct children
    const childNodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === 3 && node.textContent.trim() === '') return false;
      return true;
    });
    return childNodes.length === 1 ? childNodes[0] : childNodes;
  });

  // Compose the table so the header row is a single single-cell array, and the content row matches the columns
  const rows = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
