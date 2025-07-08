import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';

const STORAGE_KEY = '@habit_tracker_state';

export const storageService = {
  async saveState(state: AppState): Promise<void> {
    try {
      const jsonValue = JSON.stringify(state);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving state to storage:', error);
      throw error;
    }
  },

  async loadState(): Promise<AppState | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading state from storage:', error);
      throw error;
    }
  },

  async clearState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing state from storage:', error);
      throw error;
    }
  },

  async exportData(): Promise<string> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue || '{}';
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  async importData(data: string): Promise<void> {
    try {
      // Validate the data before importing
      const parsedData = JSON.parse(data);
      
      // Basic validation - check if it has the required structure
      if (typeof parsedData === 'object' && 
          parsedData.habits && 
          parsedData.user && 
          parsedData.theme) {
        await AsyncStorage.setItem(STORAGE_KEY, data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  },
};