import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { CVData } from '../types';

import regularFont from '../assets/fonts/BeVietnamPro-Regular.ttf';
import boldFont from '../assets/fonts/BeVietnamPro-Bold.ttf';

Font.register({
  family: 'BeVietnamPro',
  fonts: [
    { src: regularFont, fontWeight: 400 },
    { src: boldFont, fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    color: '#334155',
    fontFamily: 'BeVietnamPro',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #0f172a',
    paddingBottom: 10,
    flexDirection: 'row',
    gap: 20,
  },
  headerLeft: {
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    objectFit: 'cover',
    border: '1pt solid #e2e8f0',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
    fontFamily: 'BeVietnamPro',
  },
  title: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 4,
    fontWeight: 700,
    fontFamily: 'BeVietnamPro',
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    padding: '4 8',
    marginBottom: 8,
    fontFamily: 'BeVietnamPro',
  },
  rowInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  contactText: {
    fontSize: 9,
    color: '#64748b',
    fontFamily: 'BeVietnamPro',
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1e293b',
    fontFamily: 'BeVietnamPro',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#2563eb',
    marginBottom: 3,
    fontFamily: 'BeVietnamPro',
  },
  itemDescription: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.4,
    fontFamily: 'BeVietnamPro',
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
    fontFamily: 'BeVietnamPro',
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
        {data.personalInfo.avatarUrl && (
          <Image src={data.personalInfo.avatarUrl} style={styles.avatar} />
        )}
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{data.personalInfo.fullName.toUpperCase()}</Text>
          <Text style={styles.title}>{data.personalInfo.summary ? data.personalInfo.summary.split('.')[0].substring(0, 100) : ''}</Text>
          <View style={styles.rowInHeader}>
            <Text style={styles.contactText}>Email: {data.personalInfo.email}</Text>
            <Text style={styles.contactText}>SĐT: {data.personalInfo.phone}</Text>
            <Text style={styles.contactText}>Địa chỉ: {data.personalInfo.address}</Text>
          </View>
        </View>
      </View>

      {/* Tóm tắt */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{'Giới thiệu'.toUpperCase()}</Text>
        <Text style={styles.itemDescription}>{data.personalInfo.summary}</Text>
      </View>

      {/* Kinh nghiệm làm việc */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{'Kinh nghiệm làm việc'.toUpperCase()}</Text>
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
        <Text style={styles.sectionTitle}>{'Học vấn'.toUpperCase()}</Text>
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
        <Text style={styles.sectionTitle}>{'Kỹ năng chuyên môn'.toUpperCase()}</Text>
        <View style={styles.skillContainer}>
          {data.skills.map((skill, i) => (
            <View key={i} style={styles.skillBadge}>
              <Text style={{ fontFamily: 'BeVietnamPro' }}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default CVTemplate;
