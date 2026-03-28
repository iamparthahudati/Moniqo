import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

// Helper: returns a square style object for DashboardIcon squares
function squareStyle(sq: number, color: string) {
  return { width: sq, height: sq, borderRadius: 2, backgroundColor: color };
}

export const DashboardIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#94A3B8',
}) => {
  const sq = size * 0.36;
  const gap = size * 0.08;
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={{ flexDirection: 'column', gap }}>
        <View style={{ flexDirection: 'row', gap }}>
          <View style={squareStyle(sq, color)} />
          <View style={squareStyle(sq, color)} />
        </View>
        <View style={{ flexDirection: 'row', gap }}>
          <View style={squareStyle(sq, color)} />
          <View style={squareStyle(sq, color)} />
        </View>
      </View>
    </View>
  );
};

export const AnalyticsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#94A3B8',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={styles.barChart}>
      <View style={[styles.bar, { height: '50%', backgroundColor: color }]} />
      <View style={[styles.bar, { height: '75%', backgroundColor: color }]} />
      <View style={[styles.bar, { height: '60%', backgroundColor: color }]} />
      <View style={[styles.bar, { height: '90%', backgroundColor: color }]} />
    </View>
  </View>
);

export const WalletsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#94A3B8',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.walletOuter, { borderColor: color }]}>
      <View style={[styles.walletInner, { backgroundColor: color }]} />
    </View>
  </View>
);

export const AccountsNavIcon = WalletsIcon;

export const SettingsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#94A3B8',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.gearOuter, { borderColor: color }]}>
      <View style={[styles.gearInner, { backgroundColor: color }]} />
    </View>
  </View>
);

export const BellIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#0F172A',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.bellBody, { borderColor: color, borderWidth: 2 }]} />
    <View style={[styles.bellBottom, { backgroundColor: color }]} />
    <View style={[styles.bellTop, { backgroundColor: color }]} />
  </View>
);

export const ArrowUpIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#EF4444',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text style={[styles.arrowText, { color, fontSize: size * 0.9 }]}>
      {'\u2197'}
    </Text>
  </View>
);

export const ArrowDownIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#22C55E',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text style={[styles.arrowText, { color, fontSize: size * 0.9 }]}>
      {'\u2198'}
    </Text>
  </View>
);

export const TrendUpIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#22C55E',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text style={[styles.arrowText, { color, fontSize: size }]}>
      {'\u2197'}
    </Text>
  </View>
);

export const PlusIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text
      style={[
        styles.textIcon,
        {
          color,
          fontSize: size * 0.85,
          fontWeight: '300',
          lineHeight: size * 0.95,
        },
      ]}
    >
      {'+'}
    </Text>
  </View>
);

export const DotsIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#94A3B8',
}) => (
  <View style={[styles.dotsRow, { width: size }]}>
    {[0, 1, 2].map(i => (
      <View key={i} style={[styles.dot, { backgroundColor: color }]} />
    ))}
  </View>
);

export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#64748B',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text
      style={[
        styles.textIcon,
        { color, fontSize: size * 0.8, lineHeight: size },
      ]}
    >
      {'\u2304'}
    </Text>
  </View>
);

export const BackIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#0F172A',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text
      style={[
        styles.textIcon,
        { color, fontSize: size, fontWeight: '400', lineHeight: size },
      ]}
    >
      {'\u2190'}
    </Text>
  </View>
);

export const CalendarIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#64748B',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.calOuter, { borderColor: color }]}>
      <View style={[styles.calTop, { backgroundColor: color }]} />
      <View style={styles.calGrid}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <View key={i} style={[styles.calDot, { backgroundColor: color }]} />
        ))}
      </View>
    </View>
  </View>
);

export const NoteIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#64748B',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.noteOuter, { borderColor: color }]}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[
            styles.noteLine,
            { backgroundColor: color, width: i === 2 ? '60%' : '85%' },
          ]}
        />
      ))}
    </View>
  </View>
);

export const CashIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.cashOuter, { borderColor: color }]}>
      <View style={[styles.cashInner, { borderColor: color }]} />
    </View>
  </View>
);

export const BankIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#64748B',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={styles.bankWrapper}>
      <View style={[styles.bankRoof, { backgroundColor: color }]} />
      <View style={styles.bankColumns}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.bankCol, { backgroundColor: color }]} />
        ))}
      </View>
      <View style={[styles.bankBase, { backgroundColor: color }]} />
    </View>
  </View>
);

// Category icons
export const DiningIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.75, textAlign: 'center' }}>
      {'\uD83C\uDF74'}
    </Text>
  </View>
);

export const SalaryIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.75, textAlign: 'center' }}>
      {'\uD83D\uDCB5'}
    </Text>
  </View>
);

export const ShoppingIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.75, textAlign: 'center' }}>
      {'\uD83D\uDED2'}
    </Text>
  </View>
);

export const TransportIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.75, textAlign: 'center' }}>
      {'\uD83D\uDE97'}
    </Text>
  </View>
);

export const MenuIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#0F172A',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={styles.menuWrapper}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[
            styles.menuLine,
            { backgroundColor: color, width: i === 2 ? '60%' : '100%' },
          ]}
        />
      ))}
    </View>
  </View>
);

export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#94A3B8',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text
      style={[
        styles.textIcon,
        { color, fontSize: size * 0.9, fontWeight: '600', lineHeight: size },
      ]}
    >
      {'\u203A'}
    </Text>
  </View>
);

export const TrendLineIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#22C55E',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text
      style={[
        styles.textIcon,
        { color, fontSize: size * 0.85, lineHeight: size },
      ]}
    >
      {'\u2197'}
    </Text>
  </View>
);

export const BitcoinIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#2B3FE8',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text
      style={[
        styles.textIcon,
        { color, fontSize: size * 0.85, lineHeight: size },
      ]}
    >
      {'\u20BF'}
    </Text>
  </View>
);

export const PiggyIcon: React.FC<IconProps> = ({
  size = 28,
  color: _color = '#1E40AF',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <Text
      style={{
        fontSize: size * 0.8,
        includeFontPadding: false,
        lineHeight: size,
        textAlign: 'center',
      }}
    >
      {' \uD83D\uDC37'}
    </Text>
  </View>
);

export const CreditCardIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#EF4444',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.cardOuter, { borderColor: color }]}>
      <View style={[styles.cardStripe, { backgroundColor: color }]} />
    </View>
  </View>
);

export const AnalyticsNavIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#94A3B8',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={styles.lineChartWrapper}>
      <View style={[styles.lineChartBase, { borderColor: color }]} />
      <View style={[styles.lineChartLine, { borderColor: color }]} />
    </View>
  </View>
);

export const SplitsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#94A3B8',
}) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
      }}
    >
      {/* Top person */}
      <View
        style={{
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: size * 0.14,
          backgroundColor: color,
          position: 'absolute',
          top: 0,
          left: size * 0.36,
        }}
      />
      {/* Bottom left person */}
      <View
        style={{
          width: size * 0.22,
          height: size * 0.22,
          borderRadius: size * 0.11,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.05,
          left: size * 0.05,
        }}
      />
      {/* Bottom right person */}
      <View
        style={{
          width: size * 0.22,
          height: size * 0.22,
          borderRadius: size * 0.11,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.05,
          right: size * 0.05,
        }}
      />
      {/* Connecting line vertical */}
      <View
        style={{
          width: 1.5,
          height: size * 0.22,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.28,
          left: size * 0.5 - 0.75,
        }}
      />
      {/* Connecting line horizontal */}
      <View
        style={{
          width: size * 0.4,
          height: 1.5,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.27,
          left: size * 0.3,
        }}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barChart: {
    width: '85%',
    height: '85%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bar: {
    width: '20%',
    borderRadius: 2,
  },
  walletOuter: {
    width: '85%',
    height: '70%',
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 3,
  },
  walletInner: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  gearOuter: {
    width: '80%',
    height: '80%',
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearInner: {
    width: '35%',
    height: '35%',
    borderRadius: 999,
  },
  bellBody: {
    width: '65%',
    height: '65%',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: 2,
  },
  bellBottom: {
    width: '80%',
    height: 3,
    borderRadius: 2,
  },
  bellTop: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
  },
  arrowText: {
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: undefined,
  },
  textIcon: {
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  calOuter: {
    width: '90%',
    height: '90%',
    borderWidth: 1.5,
    borderRadius: 3,
    overflow: 'hidden',
    alignItems: 'center',
  },
  calTop: {
    width: '100%',
    height: '30%',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
    gap: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    margin: 1,
  },
  noteOuter: {
    width: '85%',
    height: '85%',
    borderWidth: 1.5,
    borderRadius: 3,
    padding: 2,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  noteLine: {
    height: 1.5,
    borderRadius: 1,
  },
  cashOuter: {
    width: '90%',
    height: '65%',
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashInner: {
    width: '40%',
    height: '60%',
    borderWidth: 1.5,
    borderRadius: 999,
  },
  bankWrapper: {
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankRoof: {
    width: '100%',
    height: '25%',
    borderRadius: 2,
  },
  bankColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    flex: 1,
    paddingVertical: 1,
  },
  bankCol: {
    width: '20%',
    borderRadius: 1,
  },
  bankBase: {
    width: '100%',
    height: '18%',
    borderRadius: 1,
  },
  menuWrapper: {
    width: '80%',
    height: '70%',
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
  },
  cardOuter: {
    width: '90%',
    height: '65%',
    borderWidth: 1.5,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  cardStripe: {
    width: '100%',
    height: '35%',
  },
  lineChartWrapper: {
    width: '85%',
    height: '85%',
    justifyContent: 'flex-end',
  },
  lineChartBase: {
    width: '100%',
    height: 0,
    borderBottomWidth: 1.5,
  },
  lineChartLine: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    height: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    transform: [{ rotate: '-15deg' }],
  },
});
