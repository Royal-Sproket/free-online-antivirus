// Example array of known virus signatures (SHA-256 hashes)
const virusDefinitions = [
  // Add hashes as strings, e.g.:
  "5f4dcc3b5aa765d61d8327deb882cf99", // example (not real)
  // ...
];

// Utility to compute SHA-256 hash of a File/Blob
async function hashFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function(event) {
      const arrayBuffer = event.target.result;
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      resolve(hashHex);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Function to scan a file against definitions
async function scanFile(file, onResult) {
  try {
    const fileHash = await hashFile(file);
    const isVirus = virusDefinitions.includes(fileHash);
    onResult({
      fileName: file.name,
      clean: !isVirus,
      virusSignature: isVirus ? fileHash : null
    });
  } catch (e) {
    onResult({
      fileName: file.name,
      error: e.message || "An error occurred during scanning"
    });
  }
}

// Usage example: (call this when user selects files)
// fileInput is an <input type="file" multiple>
// onResult is a callback to display scan results
function handleFiles(fileList, onResult) {
  Array.from(fileList).forEach(file => scanFile(file, onResult));
}

// Export functions for use in your HTML file
export { scanFile, handleFiles, virusDefinitions };
