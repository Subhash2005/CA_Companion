import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock DB
const clientsDB: Record<string, any> = {
  '1': { id: '1', name: 'ABC Pvt Ltd', status: 'Pending KYC', industry: 'Manufacturing', regNumber: 'CIN-U12345MH2000PTC123456', address: '123 Industrial Area, Mumbai' },
  '2': { id: '2', name: 'John Doe', status: 'Active', industry: 'Freelance IT', regNumber: 'PAN-ABCDE1234F', address: '456 Tech Park, Bangalore' },
  '3': { id: '3', name: 'Tech Solutions', status: 'Audit Due', industry: 'Software Services', regNumber: 'CIN-U98765KA2015PTC987654', address: '789 Innovation Hub, Pune' },
};

const defaultClient = { id: 'unknown', name: 'Unknown Client', status: 'Unknown', industry: 'N/A', regNumber: 'N/A', address: 'N/A' };

// Mock Documents
const mockDocuments = [
  { id: 'd1', name: 'ITR AY 2023-24.pdf', type: 'pdf', date: '2023-07-25' },
  { id: 'd2', name: 'Audit Report FY 22-23.pdf', type: 'pdf', date: '2023-09-15' },
  { id: 'd3', name: 'GST Returns Q1.pdf', type: 'pdf', date: '2023-10-05' },
  { id: 'd4', name: 'Bank Statement YTD.xlsx', type: 'excel', date: '2023-11-20' },
];

export default function ClientDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const client = clientsDB[id as string] || { ...defaultClient, id: id as string };

  // Generate 50 years of revenue data
  const revenueHistory = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const data = [];
    
    // Add current year months mock data
    data.push({ id: `rev-curr-m1`, period: 'Last Month', amount: '₹12,50,000', isMonth: true });
    data.push({ id: `rev-curr-m2`, period: '2 Months Ago', amount: '₹11,80,000', isMonth: true });

    // Generate 50 years
    for (let i = 0; i < 50; i++) {
      const year = currentYear - 1 - i;
      // Randomize revenue for mock
      const baseRev = 10000000 + (Math.random() * 50000000); // 1Cr to 6Cr
      // Adjust inflation for past years (rough estimate)
      const adjustedRev = baseRev / Math.pow(1.06, i);
      
      data.push({
        id: `rev-yr-${year}`,
        period: `FY ${year}-${(year + 1).toString().slice(2)}`,
        amount: `₹${(adjustedRev / 100000).toFixed(2)} Lakhs`,
        isMonth: false
      });
    }
    return data;
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.clientName}>{client.name}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{client.status}</Text>
          </View>
        </View>
      </View>

      {/* Company Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Details</Text>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Industry</Text>
            <Text style={styles.detailValue}>{client.industry}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reg. Number</Text>
            <Text style={styles.detailValue}>{client.regNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{client.address}</Text>
          </View>
        </View>
      </View>

      {/* Documents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue Documents</Text>
        <View style={styles.card}>
          {mockDocuments.map((doc) => (
            <TouchableOpacity key={doc.id} style={styles.documentItem}>
              <MaterialCommunityIcons 
                name={doc.type === 'pdf' ? 'file-pdf-box' : 'file-excel-box'} 
                size={32} 
                color={doc.type === 'pdf' ? '#d32f2f' : '#388e3c'} 
              />
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{doc.name}</Text>
                <Text style={styles.documentDate}>{doc.date}</Text>
              </View>
              <MaterialCommunityIcons name="download-circle-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Revenue History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue History (50 Years)</Text>
        <View style={styles.card}>
          {revenueHistory.map((item) => (
            <View key={item.id} style={[styles.revenueRow, item.isMonth && styles.revenueRowMonth]}>
              <Text style={[styles.revenuePeriod, item.isMonth && styles.revenuePeriodMonth]}>{item.period}</Text>
              <Text style={[styles.revenueAmount, item.isMonth && styles.revenueAmountMonth]}>{item.amount}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    backgroundColor: '#007AFF', 
    paddingTop: 60, 
    paddingBottom: 20, 
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { marginBottom: 15 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clientName: { fontSize: 24, fontWeight: 'bold', color: '#fff', flex: 1 },
  statusBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#333', maxWidth: '60%', textAlign: 'right' },
  
  documentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  documentInfo: { flex: 1, marginLeft: 15 },
  documentName: { fontSize: 15, fontWeight: '500', color: '#333' },
  documentDate: { fontSize: 12, color: '#888', marginTop: 2 },
  
  revenueRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  revenueRowMonth: { backgroundColor: '#f0f8ff', marginHorizontal: -15, paddingHorizontal: 15 },
  revenuePeriod: { fontSize: 15, color: '#444' },
  revenuePeriodMonth: { fontWeight: '600', color: '#007AFF' },
  revenueAmount: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  revenueAmountMonth: { color: '#007AFF' },
  
  bottomPadding: { height: 40 }
});
