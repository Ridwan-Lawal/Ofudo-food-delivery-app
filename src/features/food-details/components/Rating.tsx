import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingProps {
  rating: number;        // e.g. 4.9
  max?: number;          // default 5
  showValue?: boolean;   // show "4.9/5" text
}

export default function Rating({ rating, max = 5, showValue = true }: RatingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {Array.from({ length: max }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i)); // 0, partial, or 1
          return <Star key={i} fill={fill} />;
        })}
      </View>
      {showValue && (
        <Text style={styles.value}>{rating.toFixed(1)}/{max}</Text>
      )}
    </View>
  );
}

function Star({ fill }: { fill: number }) {
  // fill: 1 = full, 0 = empty, between = partial
  if (fill >= 1) {
    return <Ionicons name="star" size={16} color="#FE8C00" />;
  }
  if (fill <= 0) {
    return <Ionicons name="star" size={16} color="#E0E0E0" />;
  }
  // partial: empty star underneath, clipped filled star on top
  return (
    <View style={{ width: 16, height: 16 }}>
      <Ionicons name="star" size={16} color="#E0E0E0" style={StyleSheet.absoluteFill} />
      <View style={{ width: 16 * fill, height: 16, overflow: 'hidden' }}>
        <Ionicons name="star" size={16} color="#FE8C00" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stars: { flexDirection: 'row', gap: 2 },
  value: { fontSize: 14, color: '#6B6B6B', fontFamily: 'Quicksand_600SemiBold' },
});
