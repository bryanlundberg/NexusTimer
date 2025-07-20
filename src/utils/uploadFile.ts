/**
 * A simple function to upload a file to the server
 * @param file The file to upload
 * @param path The path where the file will be stored (folder name)
 * @param filename Optional filename for the uploaded file
 * @returns A promise that resolves to the upload result (url and public_id)
 */
export default async function uploadFile(file: File, path: string, filename?: string) {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!path) {
    throw new Error('No path provided');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    if (filename) {
      formData.append('filename', filename);
    }

    const response = await fetch('/api/v1/upload-image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload image');
    }

    return data;
  } catch (err) {
    throw err;
  }
}
