/* global WebImporter */
export default function parse(element, { document }) {
  // Get the heading/intro (the first .textContents containing a <p>, outside columns)
  let introBlock = null;
  const allTextContents = element.querySelectorAll('.textContents');
  for (let i = 0; i < allTextContents.length; i += 1) {
    const tc = allTextContents[i];
    // Only the intro should have only a single <p>, and not be inside a column
    if (tc.querySelector('p')) {
      introBlock = tc;
      break;
    }
  }

  // Find the columns container holding all law categories
  let columnsSection = null;
  const ft707r = element.querySelector('.css-ft707r');
  if (ft707r) {
    columnsSection = ft707r;
  }

  // Gather law area columns as cells
  let colCells = [];
  if (columnsSection) {
    // Each law area is a direct child .css-5knerd
    const colDivs = Array.from(columnsSection.querySelectorAll(':scope > .css-5knerd'));
    colCells = colDivs.map(colDiv => {
      const container = colDiv.querySelector('.css-t92nz4');
      if (!container) return '';
      // Title is in .css-u6ku3i
      const titleBlock = container.querySelector('.css-u6ku3i');
      // List in .css-er0eh1 (all <p>)
      const listBlock = container.querySelector('.css-er0eh1');
      const frag = document.createDocumentFragment();
      if (titleBlock) frag.appendChild(titleBlock);
      if (listBlock) {
        const ps = Array.from(listBlock.querySelectorAll('p'));
        if (ps.length > 0) {
          const ul = document.createElement('ul');
          ps.forEach(p => {
            const li = document.createElement('li');
            li.appendChild(p);
            ul.appendChild(li);
          });
          frag.appendChild(ul);
        }
      }
      return frag;
    });
  }

  // The intro/heading should go in the first cell of the columns row, then append the law area columns
  const contentRow = [];
  if (introBlock) {
    contentRow.push(introBlock);
  }
  contentRow.push(...colCells);

  // Compose the table structure: header and columns row only
  const tableRows = [
    ['Columns (columns10)'],
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
