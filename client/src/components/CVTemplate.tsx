import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '../types';

/**
 * Đăng ký Font chữ cho PDF (Optional - Nếu muốn dùng font tiếng Việt đẹp)
 * Mặc định PDF Renderer hỗ trợ tốt các font cơ bản. 
 * Để hỗ trợ tiếng Việt hoàn hảo, nên dùng font Roboto hoặc tương tự.
 */

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    color: '#334155',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #0f172a',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'black',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 4,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    padding: '4 8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  rowInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  contactText: {
    fontSize: 9,
    color: '#64748b',
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#2563eb',
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.4,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillBadge: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    padding: '2 6',
    borderRadius: 4,
    fontSize: 9,
    border: '1pt solid #bfdbfe',
  }
});

interface Props {
  data: CVData;
}

const CVTemplate = ({ data }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header: Thông tin cá nhân */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName}</Text>
        <Text style={styles.title}>{data.personalInfo.summary.substring(0, 50)}...</Text>
        <View style={styles.rowInHeader}>
          <Text style={styles.contactText}>📧 {data.personalInfo.email}</Text>
          <Text style={styles.contactText}>📞 {data.personalInfo.phone}</Text>
          <Text style={styles.contactText}>📍 {data.personalInfo.address}</Text>
        </View>
      </View>

      {/* Tóm tắt */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.itemDescription}>{data.personalInfo.summary}</Text>
      </View>

      {/* Kinh nghiệm làm việc */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kinh nghiệm làm việc</Text>
        {data.experience.map((exp, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.itemTitle}>{exp.position}</Text>
              <Text style={styles.contactText}>{exp.startDate} - {exp.endDate}</Text>
            </View>
            <Text style={styles.itemSubtitle}>{exp.company}</Text>
            <Text style={styles.itemDescription}>{exp.description}</Text>
          </View>
        ))}
      </View>

      {/* Học vấn */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Học vấn</Text>
        {data.education.map((edu, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.itemTitle}>{edu.school}</Text>
              <Text style={styles.contactText}>{edu.startDate} - {edu.endDate}</Text>
            </View>
            <Text style={styles.itemSubtitle}>{edu.degree} - {edu.field}</Text>
          </View>
        ))}
      </View>

      {/* Kỹ năng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kỹ năng chuyên môn</Text>
        <View style={styles.skillContainer}>
          {data.skills.map((skill, i) => (
            <View key={i} style={styles.skillBadge}>
              <Text>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default CVTemplate;
