const Tesseract = require('tesseract.js');

/**
 * Uses OCR (Tesseract.js) to extract text from image Buffers (PNG, JPG, JPEG).
 * Used for scanned resume images.
 * @param {Buffer} buffer - The image file as a Buffer
 * @returns {Promise<string>} - Extracted text via OCR
 */
const parseImage = async (buffer) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(buffer, 'eng', {
      logger: () => {}, // suppress verbose progress logs
    });
    return text.trim();
  } catch (err) {
    throw new Error(`OCR parsing failed: ${err.message}`);
  }
};

module.exports = { parseImage };
