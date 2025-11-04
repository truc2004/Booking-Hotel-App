import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';

const COLOR = {
  primary: "#2E76FF",
  secondary: "#5B9EFF",
  black: "#1A1A1A",
  darkGray: "#4A4A4A",
  gray: "#8E8E93",
  lightGray: "#C7C7CC",
  background: "#F8FAFF",
  white: "#FFFFFF",
  gold: "#FFD700",
  danger: "#FF3B30",
};

// Sample booking data
const BOOKING_DATA: Record<string, any> = {
  "1": {
    hotelName: "HarborHaven Hideaway",
    hotelAddress: "1012 Ocean avenue, New yourk, USA",
    hotelImage: require("../../../assets/images/hotel1/3.jpg"),
    rating: 4.5,
    totalReviews: 365,
    discount: "10% Off",
  },
};

export default function ReviewScreen() {
  const { booking_id } = useLocalSearchParams<{ booking_id: string }>();
  const bookingData = BOOKING_DATA[booking_id || "1"] || BOOKING_DATA["1"];

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleAddPhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5 - photos.length, // Limit to 5 photos total
      });

      if (!result.canceled) {
        const newPhotos = result.assets.map(asset => asset.uri);
        setPhotos([...photos, ...newPhotos].slice(0, 5)); // Max 5 photos
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá');
      return;
    }

    if (review.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung đánh giá');
      return;
    }

    // Submit review logic here
    console.log('Submit review:', { rating, review, photos });
    
    Alert.alert(
      'Thành công',
      'Cảm ơn bạn đã đánh giá!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header with Image */}
        <View style={styles.headerImageContainer}>
          <Image
            source={bookingData.hotelImage}
            style={styles.headerImage}
            resizeMode="cover"
          />
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLOR.black} />
          </TouchableOpacity>

          {/* Gradient Overlay */}
          <View style={styles.gradientOverlay} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hotel Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.discountRating}>
              <Text style={styles.discount}>{bookingData.discount}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={COLOR.gold} />
                <Text style={styles.ratingText}>
                  {bookingData.rating} ({bookingData.totalReviews} reviews)
                </Text>
              </View>
            </View>

            <Text style={styles.hotelName}>{bookingData.hotelName}</Text>
            <Text style={styles.hotelAddress}>{bookingData.hotelAddress}</Text>
          </View>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your overall rating of this product</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  activeOpacity={0.7}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={48}
                    color={star <= rating ? COLOR.gold : COLOR.lightGray}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Review Text Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add detailed review</Text>
            <TextInput
              style={styles.reviewInput}
              multiline
              numberOfLines={6}
              value={review}
              onChangeText={setReview}
              placeholder="Enter here"
              placeholderTextColor={COLOR.gray}
              textAlignVertical="top"
            />
          </View>

          {/* Photo Section */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handleAddPhoto}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={20} color={COLOR.primary} />
              <Text style={styles.addPhotoText}>Add photo</Text>
            </TouchableOpacity>

            {/* Photo Preview */}
            {photos.length > 0 && (
              <View style={styles.photosContainer}>
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoWrapper}>
                    <Image source={{ uri: photo }} style={styles.photoPreview} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => handleRemovePhoto(index)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close-circle" size={24} color={COLOR.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (rating === 0 || review.trim() === '') && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            activeOpacity={0.7}
            disabled={rating === 0 || review.trim() === ''}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  headerImageContainer: {
    position: "relative",
    height: 200,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 2,
    backgroundColor: COLOR.white,
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  scrollContainer: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: COLOR.white,
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  discountRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  discount: {
    backgroundColor: "#FF6B35",
    color: COLOR.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: "600",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#856404",
    fontWeight: "500",
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLOR.black,
    marginBottom: 6,
  },
  hotelAddress: {
    fontSize: 13,
    color: COLOR.gray,
  },
  section: {
    backgroundColor: COLOR.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLOR.darkGray,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: COLOR.lightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: COLOR.black,
    backgroundColor: COLOR.background,
    minHeight: 120,
    textAlignVertical: "top",
  },
  addPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLOR.primary,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  photoWrapper: {
    position: "relative",
    width: 80,
    height: 80,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLOR.white,
    borderRadius: 12,
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    backgroundColor: COLOR.white,
    borderTopWidth: 1,
    borderTopColor: COLOR.lightGray + "40",
  },
  submitButton: {
    backgroundColor: COLOR.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLOR.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonDisabled: {
    backgroundColor: COLOR.lightGray,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLOR.white,
  },
});