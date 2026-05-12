import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 15, 
    borderBottomWidth: 1,
    borderBottomColor: colors.outline
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginLeft: 15,
    color: colors.text
  },
  sectionTitle: { 
    marginLeft: 25, 
    marginTop: 25, 
    marginBottom: 10,
    textTransform: 'uppercase', 
    fontSize: 13, 
    fontWeight: '600',
    color: colors.textSecondary
  },
  card: { 
    marginHorizontal: 20, 
    padding: 20, 
    borderRadius: 20, 
    backgroundColor: colors.surface,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15
  },
  cardVertical: {
    marginHorizontal: 20, 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20, 
    backgroundColor: colors.surface,
    flexDirection: 'column', 
    alignItems: 'flex-start'
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '500',
    color: colors.text
  },
  colorRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineSoft
  },
  colorRowLast: {
    borderBottomWidth: 0
  },
  colorCircle: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: colors.outlineMuted, 
    marginRight: 15 
  },
  colorLabel: { 
    fontSize: 16,
    color: colors.text
  },
});