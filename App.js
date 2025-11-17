import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from 'react-native-safe-area-context';

const currencies = ["€", "$", "£", "¥", "₹", "₩", "₺"];

export default function App() {
  const [priceInput, setPriceInput] = useState("");
  const [discount, setDiscount] = useState(20);
  const [currency, setCurrency] = useState("€");
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const normalized = priceInput.replace(",", ".");
  const price = parseFloat(normalized);
  const isValid = !isNaN(price);

  const discountAmount = isValid ? (price * discount) / 100 : 0;
  const finalPrice = isValid ? price - discountAmount : 0;

  const handleSliderChange = (value) => {
    Haptics.selectionAsync();
    setDiscount(value);
  };

  const handleCurrencyPress = () => {
    setShowCurrencyModal(true);
  };

  const handleCurrencySelect = (symbol) => {
    setCurrency(symbol);
    setShowCurrencyModal(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.root} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.title}>Discount Calculator</Text>
          <Text style={styles.subtitle}>Calculate your savings instantly</Text>

          <View style={styles.card}>
            {/* PRICE INPUT */}
            <Text style={styles.label}>Original Price</Text>
            <View style={styles.inputBox}>
              <TouchableOpacity onPress={handleCurrencyPress}>
                <Text style={styles.currency}>{currency}</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="0"
                value={priceInput}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9.,]/g, "");
                  setPriceInput(clean);
                }}
              />
            </View>

            {/* DISCOUNT SLIDER */}
            <Text style={styles.label}>Discount</Text>
            <View style={styles.discountRow}>
              <Text style={styles.percentBox}>{discount}%</Text>
            </View>
            <Slider
              style={{ width: "100%", marginTop: 10 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={discount}
              onValueChange={handleSliderChange}
              minimumTrackTintColor="#3AA6FF"
              maximumTrackTintColor="#d3d3d3"
            />

            {/* SAVINGS */}
            <View style={styles.savingsBox}>
              <Text style={styles.savingsLabel}>You Save</Text>
              <Text style={styles.savingsAmount}>
                {currency}{discountAmount.toFixed(2)}
              </Text>
            </View>

            {/* FINAL PRICE */}
            <View style={styles.finalBox}>
              <Text style={styles.finalLabel}>Final Price</Text>
              <Text style={styles.finalAmount}>
                {currency}{finalPrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* CURRENCY MODAL */}
          <Modal
            visible={showCurrencyModal}
            animationType="slide"
            transparent
            onRequestClose={() => setShowCurrencyModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Choose Currency</Text>
                <FlatList
                  data={currencies}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => handleCurrencySelect(item)}
                      style={styles.modalItem}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </Pressable>
                  )}
                />
                <Pressable
                  onPress={() => setShowCurrencyModal(false)}
                  style={styles.modalCancel}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f2f6fb",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 14,
    color: "#7a7a7a",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
  },
  currency: {
    fontSize: 20,
    fontWeight: "600",
    marginRight: 8,
    color: "#7a7a7a",
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  percentBox: {
    backgroundColor: "#e0f7ef",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: "#28a57f",
    fontWeight: "700",
    fontSize: 16,
  },
  savingsBox: {
    backgroundColor: "#e9f9f2",
    borderRadius: 12,
    padding: 16,
    marginTop: 25,
  },
  savingsLabel: {
    color: "#2a8f6c",
    fontWeight: "600",
    fontSize: 14,
  },
  savingsAmount: {
    color: "#2a8f6c",
    fontWeight: "700",
    fontSize: 22,
  },
  finalBox: {
    backgroundColor: "#2e9cf3",
    borderRadius: 14,
    padding: 20,
    marginTop: 20,
  },
  finalLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  finalAmount: {
    color: "white",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  modalItem: {
    paddingVertical: 10,
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 18,
  },
  modalCancel: {
    marginTop: 10,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#999",
    fontSize: 16,
  },
});
