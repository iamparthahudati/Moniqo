import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../components/ui/ScreenHeader';
import { PlusIcon } from '../icons/Icons';
import { Colors } from '../theme/colors';
import { styles } from './SplitsScreen.styles';

// ── Types ──────────────────────────────────────────────────────────────────────

type BalanceStatus = 'owed' | 'owe' | 'settled';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  lastActivity: string;
  status: BalanceStatus;
  amount: number;
  color: string;
}

interface SplitItem {
  id: string;
  personName: string;
  initials: string;
  avatarColor: string;
  expenseTitle: string;
  date: string;
  amount: number;
  status: BalanceStatus;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Goa Trip',
    memberCount: 4,
    lastActivity: 'Mar 22',
    status: 'owed',
    amount: 850,
    color: '#6366F1',
  },
  {
    id: 'g2',
    name: 'Flat Expenses',
    memberCount: 3,
    lastActivity: 'Mar 25',
    status: 'owe',
    amount: 600,
    color: '#F97316',
  },
  {
    id: 'g3',
    name: 'Office Lunch',
    memberCount: 6,
    lastActivity: 'Mar 18',
    status: 'settled',
    amount: 0,
    color: '#22C55E',
  },
];

const MOCK_SPLITS: SplitItem[] = [
  {
    id: 's1',
    personName: 'Rahul',
    initials: 'RK',
    avatarColor: '#8B5CF6',
    expenseTitle: 'Dinner at Barbeque Nation',
    date: 'Mar 24, 2026',
    amount: 450,
    status: 'owed',
  },
  {
    id: 's2',
    personName: 'Priya',
    initials: 'PS',
    avatarColor: '#EC4899',
    expenseTitle: 'Movie tickets',
    date: 'Mar 20, 2026',
    amount: 200,
    status: 'owed',
  },
  {
    id: 's3',
    personName: 'Arjun',
    initials: 'AM',
    avatarColor: '#14B8A6',
    expenseTitle: 'Cab to airport',
    date: 'Mar 15, 2026',
    amount: 320,
    status: 'settled',
  },
];

// ── Summary totals derived from mock data ──────────────────────────────────────

const TOTAL_OWED = 1450;
const TOTAL_OWE = 600;

// ── Sub-components ─────────────────────────────────────────────────────────────

const SummaryBanner: React.FC = React.memo(() => (
  <View style={styles.bannerWrapper}>
    <View style={styles.bannerSide}>
      <Text style={styles.bannerLabel}>{'You are owed'}</Text>
      <Text style={[styles.bannerAmount, styles.bannerAmountOwed]}>
        {'\u20B9'}
        {TOTAL_OWED.toLocaleString('en-IN')}
      </Text>
      <Text style={styles.bannerSubtext}>{'across all groups'}</Text>
    </View>

    <View style={styles.bannerDivider} />

    <View style={styles.bannerSide}>
      <Text style={styles.bannerLabel}>{'You owe'}</Text>
      <Text style={[styles.bannerAmount, styles.bannerAmountOwe]}>
        {'\u20B9'}
        {TOTAL_OWE.toLocaleString('en-IN')}
      </Text>
      <Text style={styles.bannerSubtext}>{'to friends'}</Text>
    </View>
  </View>
));

SummaryBanner.displayName = 'SummaryBanner';

// ── Balance Pill ───────────────────────────────────────────────────────────────

const BalancePill: React.FC<{ status: BalanceStatus; amount: number }> =
  React.memo(({ status, amount }) => {
    if (status === 'settled') {
      return (
        <View style={[styles.balancePill, styles.balancePillSettled]}>
          <Text style={[styles.balancePillText, styles.balancePillTextSettled]}>
            {'Settled'}
          </Text>
        </View>
      );
    }

    const pillStyle =
      status === 'owed' ? styles.balancePillOwed : styles.balancePillOwe;
    const textStyle =
      status === 'owed'
        ? styles.balancePillTextOwed
        : styles.balancePillTextOwe;
    const prefix = status === 'owed' ? '+\u20B9' : '-\u20B9';

    return (
      <View style={[styles.balancePill, pillStyle]}>
        <Text style={[styles.balancePillText, textStyle]}>
          {prefix}
          {amount.toLocaleString('en-IN')}
        </Text>
      </View>
    );
  });

BalancePill.displayName = 'BalancePill';

// ── Group Card ─────────────────────────────────────────────────────────────────

const GroupCard: React.FC<{ group: Group }> = React.memo(({ group }) => {
  const handlePress = () => {
    Alert.alert(group.name, 'GroupDetailScreen — coming soon.');
  };

  return (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <View style={[styles.groupIconCircle, { backgroundColor: group.color }]}>
        <Text style={styles.groupIconLetter}>{group.name.charAt(0)}</Text>
      </View>

      <View style={styles.groupInfo}>
        <Text style={styles.groupName} numberOfLines={1}>
          {group.name}
        </Text>
        <Text style={styles.groupMeta}>
          {group.memberCount}
          {' members'}
          <Text style={styles.groupMetaDot}>{' \u2022 '}</Text>
          {group.lastActivity}
        </Text>
      </View>

      <View style={styles.groupRight}>
        <BalancePill status={group.status} amount={group.amount} />
      </View>
    </TouchableOpacity>
  );
});

GroupCard.displayName = 'GroupCard';

// ── Split Row ──────────────────────────────────────────────────────────────────

const SplitRow: React.FC<{ item: SplitItem }> = React.memo(({ item }) => {
  const handlePress = () => {
    Alert.alert(item.personName, 'Split detail — coming soon.');
  };

  const isSettled = item.status === 'settled';
  const isOwed = item.status === 'owed';

  return (
    <TouchableOpacity
      style={styles.splitItem}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <View
        style={[styles.avatarCircle, { backgroundColor: item.avatarColor }]}
      >
        <Text style={styles.avatarInitials}>{item.initials}</Text>
      </View>

      <View style={styles.splitInfo}>
        <Text style={styles.splitPersonName} numberOfLines={1}>
          {item.personName}
        </Text>
        <Text style={styles.splitTitle} numberOfLines={1}>
          {item.expenseTitle}
        </Text>
        <Text style={styles.splitDate}>{item.date}</Text>
      </View>

      <View style={styles.splitRight}>
        {isSettled ? (
          <View style={styles.settledBadge}>
            <Text style={styles.settledBadgeText}>{'Settled'}</Text>
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.splitAmount,
                isOwed ? styles.splitAmountOwed : styles.splitAmountOwe,
              ]}
            >
              {isOwed ? '+' : '-'}
              {'\u20B9'}
              {item.amount.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.splitDirectionLabel}>
              {isOwed ? 'owes you' : 'you owe'}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
});

SplitRow.displayName = 'SplitRow';

// ── Empty State ────────────────────────────────────────────────────────────────

const EmptyState: React.FC = React.memo(() => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconWrap}>
      <Text style={styles.emptyIconText}>{'\u21C4'}</Text>
    </View>
    <Text style={styles.emptyTitle}>{'No splits yet'}</Text>
    <Text style={styles.emptySubtext}>
      {'Split expenses with friends and track who owes what'}
    </Text>
    <TouchableOpacity
      style={styles.emptyButton}
      onPress={() =>
        Alert.alert('Create Split', 'AddGroupModal — coming soon.')
      }
      activeOpacity={0.8}
    >
      <Text style={styles.emptyButtonText}>{'Create your first split'}</Text>
    </TouchableOpacity>
  </View>
));

EmptyState.displayName = 'EmptyState';

// ── Screen ─────────────────────────────────────────────────────────────────────

const SplitsScreen: React.FC = () => {
  const hasContent = MOCK_GROUPS.length > 0 || MOCK_SPLITS.length > 0;

  const handleAddGroup = () => {
    Alert.alert('New Group', 'AddGroupModal — coming soon.');
  };

  const handleAddSplit = () => {
    Alert.alert('Add Split', 'AddSplitModal — coming soon.');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Splits"
        rightSlot={
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleAddGroup}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <PlusIcon size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      {hasContent ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Summary Banner */}
          <SummaryBanner />

          {/* Groups Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{'Groups'}</Text>
            <TouchableOpacity onPress={handleAddGroup} activeOpacity={0.7}>
              <Text style={styles.sectionAction}>{'\u002B New Group'}</Text>
            </TouchableOpacity>
          </View>

          {MOCK_GROUPS.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}

          {/* One-off Splits Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{'One-off Splits'}</Text>
            <TouchableOpacity onPress={handleAddSplit} activeOpacity={0.7}>
              <Text style={styles.sectionAction}>{'\u002B Add'}</Text>
            </TouchableOpacity>
          </View>

          {MOCK_SPLITS.map(item => (
            <SplitRow key={item.id} item={item} />
          ))}
        </ScrollView>
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

export default SplitsScreen;
