import { storage, firestore } from './firebaseconfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

export const uploadImageToFirebase = async (uri: string, username: string) => {
  try {
    console.log("Image URI:", uri);
    console.log("Username:", username);

    const response = await fetch(uri);
    const blob = await response.blob();

    const path = `user_images/${username}_${Date.now()}.jpg`;
    console.log("Uploading blob to:", path);

    const imageRef = ref(storage, path);

    const uploadTask = uploadBytesResumable(imageRef, blob);

    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log(`Upload progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        () => {
          console.log("Upload complete.");
          resolve(null);
        }
      );
    });

    const downloadURL = await getDownloadURL(imageRef);
    console.log("Download URL:", downloadURL);

    await addDoc(collection(firestore, 'users'), {
      name: username,
      imageUrl: downloadURL,
      timestamp: new Date()
    });

    console.log("Firestore document created for user:", username);
    return downloadURL;
  } catch (err) {
    console.error("Error in uploadImageToFirebase:", err);
    throw err;
  }
};
