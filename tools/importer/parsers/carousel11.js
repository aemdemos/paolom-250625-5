/* global WebImporter */
export default function parse(element, { document }) {
  // According to the block spec and example, the table always has two columns on slide rows, even if the first (image) is empty
  const headerRow = ['Carousel (carousel11)'];

  // Gather all testimonial text blocks (all .textContents inside the block)
  const allTextContents = element.querySelectorAll('.textContents');
  const textDiv = document.createElement('div');
  allTextContents.forEach(tc => {
    // Move all children, preserving semantics
    while (tc.firstChild) {
      textDiv.appendChild(tc.firstChild);
    }
  });

  // Build the slide row: always two columns, first (image) empty, second: text
  const slideRows = [[ '', textDiv ]];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...slideRows
  ], document);

  element.replaceWith(table);
}
