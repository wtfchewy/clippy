import React, { useState, useEffect } from "react";
import { Text, View, Button, Pressable, ScrollView } from "react-native";
import { Barcode } from 'expo-barcode-generator';
import { AntDesign } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';

import { loadAllCodes, removeCode, storeCode } from "./utils/storage";
import Scanner from "./components/Scanner";

export default function App() {
  const [scanning, setScanning] = useState(false);
  const [codes, setCodes] = useState([]);
  const [editing, setEditing] = useState(false);

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

  return (
    <View>
      {scanning ? 
        <Scanner onClose={() => setScanning(false)} handleBarcodeScanned={handleBarcodeScanned}/>
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
                    <Pressable className="absolute right-3 top-3 " onPress={() => removeCode(index)}>
                      <Entypo name="trash" size={24} color="#de3226" />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
          )}
          <View className="absolute bottom-10 flex flex-row px-7 w-full justify-between items-center">
            <Pressable onPress={() => setEditing(!setEditing)}>
              <AntDesign name="plus" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => setScanning(true)}> 
              <AntDesign name="scan1" size={30} color="black" />
            </Pressable>
          </View>
        </View>
      }
    </View>
  );
}