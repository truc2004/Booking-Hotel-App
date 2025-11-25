// src/favorite-rooms-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavoriteRoomsState = {
  favoriteRoomIds: string[];
  toggleFavorite: (roomId: string) => void;
  isFavorite: (roomId: string) => boolean;
  clearAll: () => void;
};

export const useFavoriteRooms = create<FavoriteRoomsState>()(
  persist(
    (set, get) => ({
      favoriteRoomIds: [],

      toggleFavorite: (roomId: string) =>
        set((state) => {
          const exists = state.favoriteRoomIds.includes(roomId);
          if (exists) {
            return {
              favoriteRoomIds: state.favoriteRoomIds.filter(
                (id) => id !== roomId
              ),
            };
          }
          return {
            favoriteRoomIds: [...state.favoriteRoomIds, roomId],
          };
        }),

      isFavorite: (roomId: string) =>
        get().favoriteRoomIds.includes(roomId),

      clearAll: () => set({ favoriteRoomIds: [] }),
    }),
    {
      name: "favorite-rooms", // key trong AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
