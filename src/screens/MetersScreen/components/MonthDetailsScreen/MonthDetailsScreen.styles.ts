import { StyleSheet } from 'react-native';

export const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailMeterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailMeterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 10,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 8,
  },
  readingsFlowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.outline,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  readingCardItem: {
    flex: 1,
    alignItems: 'center',
  },
  readingLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  readingCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  consumedHighlightBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${colors.primary}50`,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  consumedHighlightLabel: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  consumedHighlightValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  commentBubble: {
    flexDirection: 'row',
    backgroundColor: colors.outline,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.outline,
  },
  commentText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  /* --- ФОТО МІНІАТЮРА --- */
  thumbnailContainer: {
    marginTop: 15,
    height: 100,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8, // Трохи затемнюємо, щоб іконка виглядала контрастно
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* --- ПОВНОЕКРАННЕ ФОТО --- */
  fullScreenModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenCloseBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
});