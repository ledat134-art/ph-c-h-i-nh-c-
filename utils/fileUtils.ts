
export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result includes a prefix like "data:image/png;base64,"
      // We need to remove this prefix to get the pure base64 string
      const base64 = result.split(',')[1];
      const mimeType = file.type;
      resolve({ base64, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};
