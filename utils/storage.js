import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadAllCodes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@codes');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      return [];
    }
  };

export const storeCode = async (code, type) => {
    try {
        const existingCodes = await loadAllCodes();
        const newCode = { code, type };
        const updatedCodes = [...existingCodes, newCode];
        await AsyncStorage.setItem('@codes', JSON.stringify(updatedCodes));
        setCodes(updatedCodes);
    } catch (e) {
        console.log("Error storing code", e);
    }
};

export const removeCode = async (index) => {
    try {
        const existingCodes = await loadAllCodes();
        const updatedCodes = existingCodes.filter((_, i) => i !== index);
        await AsyncStorage.setItem('@codes', JSON.stringify(updatedCodes));
        setCodes(updatedCodes);
    } catch (e) {
        console.log("Error removing code", e);
    }
}