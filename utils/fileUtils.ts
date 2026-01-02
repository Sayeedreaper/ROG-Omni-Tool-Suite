export const bufferToHex = (buffer: ArrayBuffer, limit: number = 512): string => {
  const bytes = new Uint8Array(buffer);
  const length = Math.min(bytes.length, limit);
  let hex = '';
  for (let i = 0; i < length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0').toUpperCase() + ' ';
  }
  return hex.trim();
};

export const bufferToBinaryString = (buffer: ArrayBuffer, limit: number = 256): string => {
  const bytes = new Uint8Array(buffer);
  const length = Math.min(bytes.length, limit);
  let binary = '';
  for (let i = 0; i < length; i++) {
    binary += bytes[i].toString(2).padStart(8, '0') + ' ';
  }
  return binary.trim();
};

export const bufferToPythonBytes = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  // Limit for display performance
  const limit = 2000; 
  const isTruncated = bytes.length > limit;
  const processBytes = isTruncated ? bytes.slice(0, limit) : bytes;
  
  let pythonStr = "file_data = b'";
  for (let i = 0; i < processBytes.length; i++) {
    pythonStr += "\\x" + processBytes[i].toString(16).padStart(2, '0');
  }
  pythonStr += "'";
  
  if (isTruncated) {
    pythonStr += `\n# ... truncated (showing ${limit} of ${bytes.length} bytes)`;
  }
  
  return pythonStr;
};

export const bufferToCArray = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  const limit = 2000;
  const isTruncated = bytes.length > limit;
  const processBytes = isTruncated ? bytes.slice(0, limit) : bytes;
  
  let cStr = `// Generated C/C++ Array\nconst unsigned char file_data[${bytes.length}] = {\n  `;
  for (let i = 0; i < processBytes.length; i++) {
    cStr += "0x" + processBytes[i].toString(16).padStart(2, '0').toUpperCase() + ", ";
    if ((i + 1) % 12 === 0) cStr += "\n  ";
  }
  // Clean up trailing comma
  cStr = cStr.replace(/, \n  $/, "").replace(/, $/, "");
  cStr += "\n};";
  
  if (isTruncated) {
    cStr += `\n// ... truncated (showing ${limit} of ${bytes.length} bytes)`;
  }
  return cStr;
};

export const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  // Processing in chunks to avoid call stack size exceeded for large files if we spread args
  // But for display preview we limit it anyway
  const limit = 5000;
  const isTruncated = len > limit;
  const processBytes = isTruncated ? bytes.slice(0, limit) : bytes;

  for (let i = 0; i < processBytes.length; i++) {
    binary += String.fromCharCode(processBytes[i]);
  }
  
  let base64 = window.btoa(binary);
  if (isTruncated) {
     base64 += "\n\n// ... base64 truncated for preview performance";
  }
  return base64;
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};