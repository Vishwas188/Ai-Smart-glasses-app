import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { listFaces, deleteFace } from '../lib/appwriteservice';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function Gallery() {
  const [faces, setFaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullModalVisible, setFullModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchFaces = async () => {
    setLoading(true);
    try {
      const files = await listFaces();
      setFaces(files);
    } catch (error) {
      showMessage({ message: 'Failed to load gallery', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFaces();
    }, [])
  );

  const askDelete = (fileId: string) => {
    setPendingDeleteId(fileId);
    setConfirmModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteFace(pendingDeleteId);
      showMessage({ message: 'Image deleted successfully', type: 'success' });
      fetchFaces();
    } catch (error) {
      showMessage({ message: 'Failed to delete image', type: 'danger' });
    } finally {
      setConfirmModalVisible(false);
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmModalVisible(false);
    setPendingDeleteId(null);
  };

  const openFullImage = (uri: string) => {
    setSelectedImage(uri);
    setFullModalVisible(true);
  };
  const closeFullImage = () => {
    setFullModalVisible(false);
    setSelectedImage(null);
  };

  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/6846cdf800041e92dbfc/files/${item.$id}/view?project=6846cddd002d4fdc3eb3`;

    return (
      <TouchableOpacity onPress={() => openFullImage(imageUrl)} style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        <Text style={styles.imageName} numberOfLines={1}>{item.name.split('_')[0]}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => askDelete(item.$id)}
        >
          <Icon name="trash-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Recognised People</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff6600" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={faces}
          keyExtractor={(item) => item.$id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          ListEmptyComponent={<Text style={styles.empty}>No faces found</Text>}
        />
      )}

      {/* Fullscreen Modal */}
      <Modal visible={fullModalVisible} transparent={true} onRequestClose={closeFullImage}>
        <View style={styles.fullModalOverlay}>
          <Pressable style={styles.fullModalBackground} onPress={closeFullImage} />
          <Image source={{ uri: selectedImage! }} style={styles.fullImage} resizeMode="contain" />
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>Are you sure you want to delete this image?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity onPress={cancelDelete} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} style={styles.deleteConfirmBtn}>
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#0b1c39',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: {
    width: (screenWidth - 40) / 2,
    margin: 8,
    backgroundColor: '#142f5b',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 140,
  },
  imageName: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#e74c3c',
    padding: 6,
    borderRadius: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#bbb',
  },
  fullModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullModalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  fullImage: {
    width: '90%',
    height: '70%',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    width: '80%',
    backgroundColor: '#142f5b',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  deleteConfirmBtn: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
