import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadFace } from '../lib/uploadface';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ImageUploader() {
  const [imageUri, setImageUri] = useState(null);
  const [userName, setUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setModalVisible(true);
    }
  };

  const handleUpload = async () => {
    if (!imageUri || !userName.trim()) {
      showMessage({
        message: 'Username and image are required!',
        type: 'danger',
      });
      return;
    }

    try {
      setLoading(true);
      await uploadFace(imageUri, userName.trim());
      showMessage({
        message: 'Image uploaded successfully!',
        type: 'success',
      });
      setImageUri(null);
      setUserName('');
      setModalVisible(false);
    } catch (error) {
      showMessage({
        message: 'Upload failed. Try again.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* App Title & Tagline */}
      <Text style={styles.appTitle}>Visionary Lens</Text>
      <Text style={styles.tagline}>Helping You see the world</Text>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Icon name="cloud-upload-outline" size={40} color="#fff" />
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {/* Image + Name Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.preview} />
            )}
            <TextInput
              placeholder="Enter name for this image"
              placeholderTextColor="#bbb"
              value={userName}
              onChangeText={setUserName}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>Upload</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1c39', // dark navy background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#ccc',
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: '#ff6600', // bright contrast button
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(11,28,57,0.8)', // semi-transparent to match theme
  },
  modalContent: {
    margin: 30,
    backgroundColor: '#142f5b', // slightly lighter modal bg
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#555',
    marginBottom: 20,
    fontSize: 16,
    padding: 8,
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#3399ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    color: '#bbb',
  },
});
