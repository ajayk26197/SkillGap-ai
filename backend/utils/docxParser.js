const mammoth = require('mammoth');

/**
 * Extracts raw text from a .docx file buffer using mammoth.
 * @param {Buffer} buffer - The DOCX file as a Buffer
 * @returns {Promise<string>} - Extracted plain text
 */
const parseDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    if (result.messages && result.messages.length > 0) {
      console.warn('mammoth warnings:', result.messages);
    }
    return result.value.trim();
  } catch (err) {
    throw new Error(`DOCX parsing failed: ${err.message}`);
  }
};

module.exports = { parseDOCX };
