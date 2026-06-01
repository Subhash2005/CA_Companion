import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CA Companion</Text>
        <Text style={styles.subtitle}>Welcome back, CA. John</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/crm')}>
          <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
            <MaterialCommunityIcons name="account-group" size={32} color="#1e88e5" />
          </View>
          <Text style={styles.cardTitle}>Client CRM</Text>
          <Text style={styles.cardSubtitle}>Manage compliance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/analyzer')}>
          <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
            <MaterialCommunityIcons name="finance" size={32} color="#43a047" />
          </View>
          <Text style={styles.cardTitle}>Financial Analyzer</Text>
          <Text style={styles.cardSubtitle}>AI ratio analysis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        <View style={styles.deadlineCard}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#e53935" />
          <View style={styles.deadlineInfo}>
            <Text style={styles.deadlineTitle}>GSTR-3B Filing</Text>
            <Text style={styles.deadlineDate}>Due in 2 days</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#ffffff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)', elevation: 2 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  grid: { flexDirection: 'row', padding: 20, gap: 15 },
  card: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 15, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)', elevation: 3 },
  iconContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  cardSubtitle: { fontSize: 12, color: '#888', marginTop: 4 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  deadlineCard: { flexDirection: 'row', backgroundColor: '#ffffff', padding: 15, borderRadius: 12, alignItems: 'center', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', elevation: 2 },
  deadlineInfo: { marginLeft: 15 },
  deadlineTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  deadlineDate: { fontSize: 14, color: '#e53935', marginTop: 2 }
});
