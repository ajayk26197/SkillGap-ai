const pdfParse = require('pdf-parse');

/**
 * Extracts raw text from a PDF file buffer.
 * @param {Buffer} buffer - The PDF file as a Buffer
 * @returns {Promise<string>} - Extracted plain text
 */
const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (err) {
    throw new Error(`PDF parsing failed: ${err.message}`);
  }
};

module.exports = { parsePDF };
