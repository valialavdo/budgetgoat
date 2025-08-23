import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  Alert
} from 'react-native';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  Wallet, 
  Bank, 
  TrendUp, 
  Info,
  MagnifyingGlass
} from 'phosphor-react-native';
import { BudgetContext } from '../context/BudgetContext';
import { Colors, Spacing, Radius, Typography, Layout, Shadows } from '../theme';
import Header from '../components/Header';
import FloatingActionButton from '../components/FloatingActionButton';
import CategoryForm from '../components/CategoryForm';
import InfoBottomSheet from '../components/InfoBottomSheet';
import { Category, CategoryType } from '../types';

export default function CategoriesScreen() {
  const { state, deleteCategories } = useContext(BudgetContext);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | CategoryType>('all');
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!state || !state.categories) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Categories...</Text>
      </View>
    );
  }

  const filteredCategories = state.categories.filter(category => {
    const matchesFilter = selectedFilter === 'all' || category.type === selectedFilter;
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteCategories([categoryId])
        }
      ]
    );
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    // TODO: Implement category creation/update logic
    console.log('Saving category:', categoryData);
    setShowCategoryForm(false);
  };

  const getCategoryIcon = (type: CategoryType) => {
    switch (type) {
      case 'income': return '💰';
      case 'bank': return '🏦';
      case 'extra': return '💸';
      default: return '📁';
    }
  };

  const getCategoryColor = (type: CategoryType) => {
    switch (type) {
      case 'income': return Colors.income;
      case 'bank': return Colors.pocket;
      case 'extra': return Colors.expense;
      default: return Colors.textMuted;
    }
  };

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'all' && styles.filterTabSelected
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'all' && styles.filterTabTextSelected
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'income' && styles.filterTabSelected
          ]}
          onPress={() => setSelectedFilter('income')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'income' && styles.filterTabTextSelected
          ]}>
            💰 Income
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'bank' && styles.filterTabSelected
          ]}
          onPress={() => setSelectedFilter('bank')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'bank' && styles.filterTabTextSelected
          ]}>
            🏦 Banks/Pockets
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'extra' && styles.filterTabSelected
          ]}
          onPress={() => setSelectedFilter('extra')}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === 'extra' && styles.filterTabTextSelected
          ]}>
            💸 Expenses
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <MagnifyingGlass weight="regular" size={18} color={Colors.textMuted} />
        <Text style={styles.searchInput}>
          {searchQuery || 'Search categories...'}
        </Text>
      </View>
    </View>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(item.type)}</Text>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryType}>{item.type}</Text>
          </View>
        </View>
        
        <View style={styles.categoryAmount}>
          <Text style={[
            styles.amountText,
            { color: getCategoryColor(item.type) }
          ]}>
            €{Math.abs(item.defaultAmount).toFixed(2)}
          </Text>
          <Text style={styles.amountLabel}>
            {item.isInflux ? 'Income' : 'Outflow'}
          </Text>
        </View>
      </View>
      
      <View style={styles.categoryActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditCategory(item)}
        >
          <PencilSimple weight="regular" size={16} color={Colors.trustBlue} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteCategory(item.id)}
        >
          <Trash weight="regular" size={16} color={Colors.alertRed} />
          <Text style={[styles.actionText, { color: Colors.alertRed }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Wallet weight="regular" size={64} color={Colors.textMuted} />
      <Text style={styles.emptyStateTitle}>No Categories Yet</Text>
      <Text style={styles.emptyStateText}>
        Create your first category to start budgeting like a GOAT!
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={handleAddCategory}
      >
        <Text style={styles.emptyStateButtonText}>Create Category</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInfoContent = () => (
    <View>
      <Text style={styles.infoTitle}>Category Management Guide</Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>💰 Income Categories</Text>
        <Text style={styles.infoText}>
          Track money coming in (salary, gifts, bonuses). Set allocation rules to automatically distribute to pockets.
        </Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>🏦 Bank/Pocket Categories</Text>
        <Text style={styles.infoText}>
          Where you store money (checking, savings, investment accounts). These accumulate funds over time.
        </Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>💸 Expense Categories</Text>
        <Text style={styles.infoText}>
          Track money going out (groceries, bills, entertainment). Use negative amounts for expenses.
        </Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>💡 Pro Tips</Text>
        <Text style={styles.infoText}>
          • Use recurring categories for monthly expenses{'\n'}
          • Set allocation rules for automatic pocket distribution{'\n'}
          • Review and adjust categories monthly for best results
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Categories" 
        rightIcon={<Info weight="regular" size={20} color={Colors.trustBlue} />}
        onRightPress={() => setShowInfoSheet(true)}
      />
      
      <View style={styles.content}>
        {renderFilterTabs()}
        {renderSearchBar()}
        
        {filteredCategories.length > 0 ? (
          <FlatList
            data={filteredCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          renderEmptyState()
        )}
      </View>

      <FloatingActionButton
        icon={<Plus weight="regular" size={24} color={Colors.background} />}
        onPress={handleAddCategory}
        accessibilityLabel="Add new category"
      />

      <CategoryForm
        visible={showCategoryForm}
        onClose={() => setShowCategoryForm(false)}
        onSave={handleSaveCategory}
        initialData={editingCategory || undefined}
        isEditing={!!editingCategory}
      />

      <InfoBottomSheet
        visible={showInfoSheet}
        onClose={() => setShowInfoSheet(false)}
        title="Category Guide"
        content={renderInfoContent()}
        icon={<Info weight="regular" size={24} color={Colors.trustBlue} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    ...Typography.h3,
    color: Colors.textMuted,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  filterContainer: {
    marginVertical: Spacing.md,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabSelected: {
    backgroundColor: Colors.trustBlue,
    borderColor: Colors.trustBlue,
  },
  filterTabText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  filterTabTextSelected: {
    color: Colors.background,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    ...Typography.body,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  categoryCard: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  categoryType: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    ...Typography.h4,
    fontWeight: '700',
  },
  amountLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: {
    ...Typography.caption,
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateButton: {
    backgroundColor: Colors.goatGreen,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  emptyStateButtonText: {
    ...Typography.button,
    color: Colors.background,
  },
  infoTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  infoSection: {
    marginBottom: Spacing.lg,
  },
  infoSectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
});


