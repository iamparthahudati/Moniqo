import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  ACCOUNTS_BALANCE_CHANGE_PCT,
  ACCOUNTS_TOTAL_BALANCE,
  BANK_ACCOUNTS,
  CARD_ACCOUNTS,
  CASH_ENTRIES,
  INVESTMENTS,
} from '../data/mockData';
import {
  BankIcon,
  BitcoinIcon,
  CashIcon,
  ChevronRightIcon,
  CreditCardIcon,
  MenuIcon,
  PiggyIcon,
  PlusIcon,
  TrendLineIcon,
} from '../icons/Icons';
import { Colors } from '../theme/colors';
import { BankAccount, CardAccount, CashEntry, Investment } from '../types';
import { styles } from './AccountsScreen.styles';

// ── Helpers ───────────────────────────────────────────────────────────────────

const getBankIcon = (icon: BankAccount['icon'], color: string) => {
  const bg = `${color}18`;
  if (icon === 'piggy') {
    return (
      <View style={[styles.accountIconCircle, { backgroundColor: bg }]}>
        <PiggyIcon size={26} color={color} />
      </View>
    );
  }
  return (
    <View style={[styles.accountIconCircle, { backgroundColor: bg }]}>
      <BankIcon size={24} color={color} />
    </View>
  );
};

const getInvestIcon = (icon: Investment['icon'], color: string) => {
  switch (icon) {
    case 'bitcoin':
      return <BitcoinIcon size={22} color={color} />;
    case 'trend':
      return <TrendLineIcon size={22} color={color} />;
    default:
      return <TrendLineIcon size={22} color={color} />;
  }
};

const formatAmount = (n: number) =>
  `\u20B9${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

// ── Sub-components ────────────────────────────────────────────────────────────

const TotalBalanceCard: React.FC = () => (
  <View style={styles.totalCard}>
    <Text style={styles.totalLabel}>Total Balance</Text>
    <Text style={styles.totalAmount}>
      {`\u20B9${ACCOUNTS_TOTAL_BALANCE.toLocaleString('en-IN')}`}
    </Text>
    <View style={styles.totalSubRow}>
      <Text style={styles.totalSubText}>Across all accounts</Text>
      <View style={styles.totalBadge}>
        <TrendLineIcon size={11} color={Colors.incomeGreen} />
        <Text style={styles.totalBadgeText}>{ACCOUNTS_BALANCE_CHANGE_PCT}</Text>
      </View>
    </View>
  </View>
);

const BankAccountRow: React.FC<{ account: BankAccount }> = ({ account }) => (
  <TouchableOpacity style={styles.accountCard} activeOpacity={0.75}>
    {getBankIcon(account.icon, account.color)}
    <View style={styles.accountInfo}>
      <Text style={styles.accountName}>{account.bankName}</Text>
      <Text style={styles.accountType}>{account.accountType}</Text>
    </View>
    <View style={styles.accountRight}>
      <Text style={styles.accountBalance}>{formatAmount(account.balance)}</Text>
      <Text style={styles.accountStatus}>{account.status}</Text>
    </View>
    <View style={styles.chevron}>
      <ChevronRightIcon size={16} color={Colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const CardAccountRow: React.FC<{ card: CardAccount }> = ({ card }) => (
  <TouchableOpacity style={styles.accountCard} activeOpacity={0.75}>
    <View
      style={[
        styles.accountIconCircle,
        { backgroundColor: 'rgba(239,68,68,0.1)' },
      ]}
    >
      <CreditCardIcon size={24} color={card.color} />
    </View>
    <View style={styles.accountInfo}>
      <Text style={styles.accountName}>{card.cardName}</Text>
      <Text style={styles.accountType}>{card.cardType}</Text>
    </View>
    <View style={styles.accountRight}>
      <Text style={styles.accountDueDash}>{'-'}</Text>
      <Text style={styles.accountDueAmount}>
        {formatAmount(card.dueAmount)}
      </Text>
      <Text style={styles.accountStatusDue}>{card.dueLabel}</Text>
    </View>
    <View style={styles.chevron}>
      <ChevronRightIcon size={16} color={Colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const InvestmentGrid: React.FC = () => (
  <View style={styles.investGrid}>
    {INVESTMENTS.map(inv => (
      <TouchableOpacity
        key={inv.id}
        style={styles.investCard}
        activeOpacity={0.75}
      >
        <View
          style={[
            styles.investIconCircle,
            { backgroundColor: `${inv.color}18` },
          ]}
        >
          {getInvestIcon(inv.icon, inv.color)}
        </View>
        <View>
          <Text style={styles.investName}>{inv.name}</Text>
          <Text style={styles.investAmount}>{formatAmount(inv.amount)}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

const CashRow: React.FC<{ entry: CashEntry }> = ({ entry }) => (
  <View style={styles.cashCard}>
    <View style={styles.cashIconCircle}>
      <CashIcon size={22} color={Colors.primary} />
    </View>
    <View style={styles.cashInfo}>
      <Text style={styles.cashLabel}>{entry.label}</Text>
      <Text style={styles.cashSublabel}>{entry.sublabel}</Text>
    </View>
    <Text style={styles.cashAmount}>{formatAmount(entry.amount)}</Text>
  </View>
);

// ── Screen ────────────────────────────────────────────────────────────────────

const AccountsScreen: React.FC = () => (
  <View style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
        <MenuIcon size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Accounts</Text>
      <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
        <PlusIcon size={22} color={Colors.primary} />
      </TouchableOpacity>
    </View>

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Total Balance */}
      <TotalBalanceCard />

      {/* Banks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Banks</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {BANK_ACCOUNTS.map(acc => (
          <BankAccountRow key={acc.id} account={acc} />
        ))}
      </View>

      {/* Cards */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cards</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {CARD_ACCOUNTS.map(card => (
          <CardAccountRow key={card.id} card={card} />
        ))}
      </View>

      {/* Investments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Investments</Text>
        </View>
        <InvestmentGrid />
      </View>

      {/* Cash */}
      <View style={styles.section}>
        {CASH_ENTRIES.map(entry => (
          <CashRow key={entry.id} entry={entry} />
        ))}
      </View>
    </ScrollView>
  </View>
);

export default AccountsScreen;
