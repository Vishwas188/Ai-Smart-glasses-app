// lib/uploadFace.js
import { ID } from './appwriteconfig';

export const uploadFace = async (uri, userName) => {
  const bucketId  = '6846cdf800041e92dbfc';
  const projectId = '6846cddd002d4fdc3eb3';
  const apiKey    = 'standard_6a95d63bb73e93288b993cfc29e4e05de46de6b3198859d8ae93c5fde4e90c7c5bfd8b2725c4c4ffb553d3e7d4d20cb65d4f23df55910ea1e9cc4cb30b83153676739eaa5361de8b497992decbe3c47795e05fb7a792ec35a4fc7613c65c4099ae5285a0353686ecb07009e92eedf08c0591e7a383489d85ee917233a6bdf0c0';

  const fileId   = ID.unique();
  const fileName = `${userName}_${Date.now()}.jpg`;

  // 1️⃣ Build FormData
  const form = new FormData();
  form.append('file', {
    uri,
    name: fileName,
    type: 'image/jpeg',
  });
  form.append('fileId', fileId); // <-- Pass fileId here

  // 2️⃣ POST to Appwrite Storage endpoint (without fileId in URL)
  const res = await fetch(
    `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files`,
    {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': apiKey,
        // DO NOT set Content-Type manually for FormData
      },
      body: form,
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Upload failed: ${errorBody}`);
  }

  return res.json(); // Returns the uploaded file object
};

