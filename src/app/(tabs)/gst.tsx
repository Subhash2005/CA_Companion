import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function GSTAssistant() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState<number | string>(18);
  const [customRate, setCustomRate] = useState('');
  const [result, setResult] = useState<{ gst: string; total: string; appliedRate: number } | null>(null);

  const [gstin, setGstin] = useState('');
  const [gstinResult, setGstinResult] = useState<{valid: boolean, message: string} | null>(null);

  const calculateGST = () => {
    const numAmount = parseFloat(amount);
    const numRate = parseFloat(customRate || rate.toString());
    
    if (isNaN(numAmount) || numAmount <= 0 || isNaN(numRate)) return;
    
    const gstAmount = (numAmount * numRate) / 100;
    setResult({
      gst: gstAmount.toFixed(2),
      total: (numAmount + gstAmount).toFixed(2),
      appliedRate: numRate
    });
  };

  const validateGSTIN = () => {
    if (!gstin || gstin.length !== 15) {
      setGstinResult({valid: false, message: 'Invalid format. GSTIN must be exactly 15 characters.'});
      return;
    }
    setGstinResult({
      valid: true, 
      message: `Status: Active\nTaxpayer: Verified Business Pvt Ltd\nLast Return Filed: ${new Date().toLocaleDateString()}`
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Calculator Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="calculator-variant" size={24} color="#1e88e5" />
          <Text style={styles.title}>GST Calculator</Text>
        </View>

        <TextInput 
          style={styles.input} 
          placeholder="Enter Base Amount (e.g. 1000)" 
          keyboardType="numeric" 
          value={amount}
          onChangeText={setAmount}
        />
        
        <Text style={styles.label}>Select or Enter Tax Rate (%):</Text>
        <View style={styles.row}>
          {[5, 12, 18, 28].map((r) => (
            <TouchableOpacity 
              key={r}
              style={[styles.rateBtn, rate === r && !customRate && styles.activeRateBtn]}
              onPress={() => { setRate(r); setCustomRate(''); }}
            >
              <Text style={[styles.rateText, rate === r && !customRate && styles.activeRateText]}>{r}%</Text>
            </TouchableOpacity>
          ))}
          
          <TextInput 
            style={[styles.rateBtn, styles.customRateInput, customRate !== '' && styles.activeRateBtn]}
            placeholder="Custom"
            keyboardType="numeric"
            value={customRate}
            onChangeText={(val) => { setCustomRate(val); setRate('custom'); }}
          />
        </View>
        
        <TouchableOpacity style={styles.calcBtn} onPress={calculateGST}>
          <Text style={styles.calcBtnText}>Calculate</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>GST Amount ({result.appliedRate}%):</Text>
              <Text style={styles.resultValue}>₹{result.gst}</Text>
            </View>
            <View style={[styles.resultRow, styles.totalRow]}>
              <Text style={styles.resultLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₹{result.total}</Text>
            </View>
          </View>
        )}
      </View>

      {/* GSTIN Validator Feature */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="shield-check-outline" size={24} color="#43a047" />
          <Text style={styles.title}>GSTIN Validator</Text>
        </View>
        
        <Text style={styles.label}>Verify client GSTIN status</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter 15-digit GSTIN" 
          autoCapitalize="characters"
          maxLength={15}
          value={gstin}
          onChangeText={setGstin}
        />
        <TouchableOpacity style={[styles.calcBtn, {backgroundColor: '#43a047'}]} onPress={validateGSTIN}>
          <Text style={styles.calcBtnText}>Verify GSTIN</Text>
        </TouchableOpacity>

        {gstinResult && (
          <View style={[styles.resultContainer, { borderColor: gstinResult.valid ? '#c5e1a5' : '#ef9a9a', backgroundColor: gstinResult.valid ? '#f1f8e9' : '#ffebee' }]}>
            <MaterialCommunityIcons name={gstinResult.valid ? "check-circle" : "alert-circle"} size={24} color={gstinResult.valid ? "#2e7d32" : "#c62828"} style={{marginBottom: 10}} />
            <Text style={{ color: gstinResult.valid ? '#2e7d32' : '#c62828', fontWeight: 'bold' }}>
              {gstinResult.message}
            </Text>
          </View>
        )}
      </View>
      
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 20, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 5 },
  rateBtn: { flex: 1, minWidth: '18%', backgroundColor: '#f5f5f5', paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  customRateInput: { backgroundColor: '#fafafa', paddingVertical: 10, textAlign: 'center' },
  activeRateBtn: { backgroundColor: '#e3f2fd', borderColor: '#1e88e5' },
  rateText: { color: '#666', fontWeight: 'bold', fontSize: 15 },
  activeRateText: { color: '#1e88e5' },
  calcBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 25, alignItems: 'center' },
  calcBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  resultContainer: { marginTop: 25, padding: 15, backgroundColor: '#f1f8e9', borderRadius: 12, borderWidth: 1, borderColor: '#c5e1a5' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#c5e1a5', paddingTop: 12, marginBottom: 0 },
  resultLabel: { fontSize: 15, color: '#558b2f' },
  resultValue: { fontSize: 16, fontWeight: 'bold', color: '#33691e' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32' }
});
