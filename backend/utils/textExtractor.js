const { parsePDF } = require('./pdfParser');
const { parseDOCX } = require('./docxParser');
const { parseImage } = require('./ocrParser');

const MIME_MAP = {
  'application/pdf': parsePDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': parseDOCX,
  'image/png': parseImage,
  'image/jpeg': parseImage,
  'image/jpg': parseImage,
};

/**
 * Routes a file Buffer to the correct parser based on its MIME type.
 * Supports: PDF → pdf-parse, DOCX → mammoth, PNG/JPG → Tesseract OCR
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - MIME type of the file
 * @returns {Promise<string>} - Extracted plain text
 */
const extractText = async (buffer, mimetype) => {
  const parser = MIME_MAP[mimetype];
  if (!parser) {
    throw new Error(`Unsupported file type: ${mimetype}. Accepted: PDF, DOCX, PNG, JPG.`);
  }
  return parser(buffer);
};

module.exports = { extractText };
