/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns12) block, 1 header row + 1 row with 3 columns
  const headerRow = ['Columns (columns12)'];

  // Find the container holding the three stat columns
  // Look for the direct children of the innermost flex container
  // Find the last .css-5knerd inside the element
  let statsContainer = null;
  const all5knerd = element.querySelectorAll('.css-5knerd');
  if (all5knerd.length > 0) {
    statsContainer = all5knerd[all5knerd.length - 1];
  }
  // Fallback: use the deepest element with multiple children
  if (!statsContainer || statsContainer.children.length < 3) {
    statsContainer = Array.from(element.querySelectorAll('.css-5knerd')).reverse()
      .find(el => el.children.length >= 3);
  }
  if (!statsContainer) {
    // Can't find the stats columns, abort
    return;
  }

  // Each direct child of statsContainer is a column
  const columns = Array.from(statsContainer.children).map(col => {
    // Get all <p> tags under this column, preserving their order
    const ps = col.querySelectorAll('p');
    return Array.from(ps);
  });

  // If for some reason there are not exactly 3 columns, gracefully degrade
  const cellRow = columns.length > 0 ? columns : [[document.createTextNode('')]];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellRow
  ], document);

  element.replaceWith(table);
}
