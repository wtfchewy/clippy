import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, Button, Pressable, ScrollView } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { Barcode } from 'expo-barcode-generator';
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
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
      console.log("Error storing code", e);
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
    const parts = type.split('.');
    storeCode(data, parts[parts.length - 1]);
    setScanning(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View>
      {scanning ? 
      <View className='h-full flex flex-col'>
        <View className='flex flex-row items-center justify-between mb-2 mt-14 px-7'>
          <Text className="text-black font-bold text-3xl">Scan a Barcode</Text>
          <Pressable onPress={() => setScanning(false)}>
            <FontAwesomeIcon size={28} icon={faClose}/>
          </Pressable>
        </View>
        <CameraView
        className="w-full h-full"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417", "aztec", "ean13", "ean8", "upc_e", "datamatrix", "code39", "code93", "code128", "itf", "codabar", "upc_a"] }}
        />
    </View>
    : 
    <View className="bg-zinc-100 w-full h-full">
      <Text className="mt-24 mx-7 text-black font-black text-4xl">Barcodes</Text>
      {codes.length === 0 ? (
          <Text className="mt-10 mx-10">No codes scanned yet</Text>
        ) : (
          <ScrollView className="pt-5 px-5 flex gap-2">
            {codes.map((code, index) => (
              <View key={index} className="bg-white rounded-lg p-2 flex justify-center items-center">
                <Barcode
                  value={code.code}
                  options={{ background: '' }}
                  type={code.type}
                />
              </View>
            ))}
          </ScrollView>
      )}
      <View className="absolute bottom-10 flex flex-row px-7 w-full justify-between items-center">
        <Pressable onPress={() => setScanning(true)}> 
          <FontAwesomeIcon size={30} icon={faPlus}/>
        </Pressable>
        <Button title="Clear Codes" onPress={() => AsyncStorage.setItem('@codes', '')}/>
      </View>
    </View>
  }
    </View>
  );
}