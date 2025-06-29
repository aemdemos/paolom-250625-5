/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match: Carousel (carousel4)
  const cells = [['Carousel (carousel4)']];

  // Find all testimonial slides by extracting grouped .textContents blocks
  // The structure is: two .textContents elements per slide: [quote, author]
  const textDivs = Array.from(element.querySelectorAll('.textContents'));
  // We'll look for pairs: quote, author
  for (let i = 0; i < textDivs.length; i += 2) {
    const quoteDiv = textDivs[i];
    const authorDiv = textDivs[i + 1];
    if (!quoteDiv) continue; // skip if no quote

    // First cell: no image, so pass an empty string
    // Second cell: include the quote and author, using original elements
    // Reference the *existing* <p> elements, not clones
    const content = [];
    const quoteP = quoteDiv.querySelector('p');
    const authorP = authorDiv ? authorDiv.querySelector('p') : null;
    if (quoteP) content.push(quoteP);
    if (authorP) {
      content.push(document.createElement('br'));
      content.push(authorP);
    }
    cells.push(['', content]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
