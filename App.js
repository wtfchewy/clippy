import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { Barcode } from 'expo-barcode-generator';
import { faBarcode, faCamera } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [codes, setCodes] = useState([]);

  const loadAllCodes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@codes');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      return [];
    }
  };

  const storeCode = async (code, type) => {
    try {
      const existingCodes = await loadAllCodes();
      const newCode = { code, type };
      const updatedCodes = [...existingCodes, newCode];
      await AsyncStorage.setItem('@codes', JSON.stringify(updatedCodes));
      setCodes(updatedCodes);
    } catch (e) {
    }
  };

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useEffect(() => {
    const fetchCodes = async () => {
      const loadedCodes = await loadAllCodes();
      setCodes(loadedCodes);
    };

    fetchCodes();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanning(false);
    storeCode(data, type);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {scanning ? 
      <CameraView
      onBarcodeScanned={handleBarcodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: ["qr", "pdf417", "aztec", "ean13", "ean8", "upc_e", "datamatrix", "code39", "code93", "code128", "itf", "codabar", "upc_a"],
      }}
      style={StyleSheet.absoluteFillObject}
    />
    : 
    <View className="bg-white w-full h-full">
      <Text className="mt-28 mx-10 text-black font-black text-4xl">Barcodes</Text>
      {codes.length === 0 ? (
          <Text>No codes scanned yet</Text>
        ) : (
          <View className="mt-10 mx-10 flex">
            {codes.map((code, index) => (
              <Text key={index}>{code.type}: {code.code}</Text>
            ))}
          </View>
      )}
      <View className="absolute bottom-10 flex flex-row px-6 w-full justify-between items-center">
        <Pressable onPress={() => setScanning(true)}> 
          <FontAwesomeIcon size={30} icon={faCamera}/>
        </Pressable>
      </View>
    </View>
  }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});