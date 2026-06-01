import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Dummy tasks for specific dates
const tasksData: Record<number, Array<{id: string, title: string, type: string, color: string}>> = {
  7: [{ id: 't1', title: 'TDS Payment', type: 'Income Tax', color: '#fb8c00' }],
  20: [{ id: 't2', title: 'GSTR-3B Filing', type: 'GST', color: '#e53935' }, { id: 't3', title: 'Client Meeting - AlphaCorp', type: 'Meeting', color: '#1e88e5' }],
  30: [{ id: 't4', title: 'ROC Filing Prep', type: 'Company Law', color: '#8e24aa' }]
};

export default function CalendarHub() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();

  // Simple grid generation (1 to 31)
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDayPress = (day: number) => {
    setSelectedDate(day);
    setModalVisible(true);
  };

  const getSelectedTasks = () => {
    if (!selectedDate) return [];
    return tasksData[selectedDate] || [];
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{currentMonth} {currentYear}</Text>
        <MaterialCommunityIcons name="calendar-month" size={28} color="#007AFF" />
      </View>

      {/* Weekdays Header */}
      <View style={styles.weekRow}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <Text key={idx} style={styles.weekText}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.grid}>
        {/* Padding for start of month (assuming 1st is on a Tuesday for visual dummy) */}
        <View style={styles.dayBox} /><View style={styles.dayBox} />
        
        {daysArray.map((day) => {
          const isToday = day === currentDay;
          const hasTasks = !!tasksData[day];
          
          return (
            <TouchableOpacity 
              key={day} 
              style={[styles.dayBox, isToday && styles.todayBox]}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
              {hasTasks && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.tipText}>Tap on a date to view scheduled compliance work.</Text>

      {/* Popup Modal for Tasks */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDate === currentDay ? "Today's Work" : `Work for ${selectedDate} ${currentMonth}`}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close-circle" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            {getSelectedTasks().length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="check-all" size={48} color="#c5e1a5" />
                <Text style={styles.emptyText}>No work scheduled for this date!</Text>
              </View>
            ) : (
              <FlatList
                data={getSelectedTasks()}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.taskCard}>
                    <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                      <MaterialCommunityIcons name="briefcase-clock-outline" size={24} color={item.color} />
                    </View>
                    <View style={styles.taskInfo}>
                      <Text style={styles.taskTitle}>{item.title}</Text>
                      <Text style={styles.taskType}>{item.type}</Text>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  
  weekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  weekText: { fontSize: 14, fontWeight: 'bold', color: '#888', width: 40, textAlign: 'center' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 16, padding: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  dayBox: { width: '14%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  todayBox: { backgroundColor: '#007AFF', borderRadius: 20 },
  dayText: { fontSize: 16, color: '#333', fontWeight: '500' },
  todayText: { color: '#fff', fontWeight: 'bold' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#e53935', marginTop: 3 },
  
  tipText: { textAlign: 'center', color: '#888', marginTop: 25, fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, minHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyText: { color: '#666', fontSize: 16, marginTop: 10 },
  
  taskCard: { flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  iconBox: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  taskInfo: { flex: 1, marginLeft: 15 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  taskType: { fontSize: 13, color: '#888', marginTop: 4 }
});
