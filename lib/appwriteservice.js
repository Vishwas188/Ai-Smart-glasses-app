// lib/appwriteService.js
import { ID } from './appwriteconfig';

const ENDPOINT    = 'https://cloud.appwrite.io/v1';
const PROJECT_ID  = '6846cddd002d4fdc3eb3';
const API_KEY     = 'standard_6a95d63bb73e93288b993cfc29e4e05de46de6b3198859d8ae93c5fde4e90c7c5bfd8b2725c4c4ffb553d3e7d4d20cb65d4f23df55910ea1e9cc4cb30b83153676739eaa5361de8b497992decbe3c47795e05fb7a792ec35a4fc7613c65c4099ae5285a0353686ecb07009e92eedf08c0591e7a383489d85ee917233a6bdf0c0';
const BUCKET_ID   = '6846cdf800041e92dbfc';

const commonHeaders = {
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

// 1️⃣ List all files in the bucket
export async function listFaces() {
  const res = await fetch(
    `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files`,
    {
      headers: commonHeaders,
    }
  );
  if (!res.ok) throw new Error(`Failed to list files: ${await res.text()}`);
  const data = await res.json();
  // data.files is an array of { $id, name, mimeType, $permissions, ... }
  return data.files;
}

// 2️⃣ Delete a file by its ID
export async function deleteFace(fileId) {
  const res = await fetch(
    `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}`,
    {
      method: 'DELETE',
      headers: commonHeaders,
    }
  );
  if (!res.ok) throw new Error(`Failed to delete file: ${await res.text()}`);
  return true;
}
