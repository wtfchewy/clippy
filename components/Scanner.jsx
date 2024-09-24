import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";

const Scanner = ({ onClose, handleBarcodeScanned }) => {
    const [hasPermission, setHasPermission] = useState(null);


    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View className='h-full flex flex-col'>
            <View className='flex flex-row items-center justify-between mb-2 mt-14 px-7'>
                <Text className="text-black font-bold text-3xl">Scan a Barcode</Text>
                <Pressable onPress={onClose}>
                    <AntDesign name="close" size={28} color="black" />
                </Pressable>
            </View>
            <CameraView className="w-full h-full" onBarcodeScanned={handleBarcodeScanned} barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417", "aztec", "ean13", "ean8", "upc_e", "datamatrix", "code39", "code93", "code128", "itf", "codabar", "upc_a"] }}/>
        </View>
    );
    }

export default Scanner;