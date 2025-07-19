/**
 * A simple function to upload a file to the server
 * @param file The file to upload
 * @returns A promise that resolves to the upload result (url and public_id)
 */
export default async function uploadFile(file: File) {
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-image', {
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
