import { create } from 'zustand';
import { 
  DarkPoolTrade, 
  PriceLevel, 
  DarkPoolLevels, 
  DarkPoolSummary, 
  DarkPoolHeatmap,
  getDarkPoolTrades,
  getPriceLevels,
  getDarkPoolSummary,
  getDarkPoolHeatmap
} from '../services/dark-pool-service';

interface DarkPoolState {
  // Data
  darkPoolTrades: DarkPoolTrade[];
  priceLevels: DarkPoolLevels | null;
  darkPoolSummary: DarkPoolSummary | null;
  darkPoolHeatmap: DarkPoolHeatmap | null;
  
  // UI state
  selectedTicker: string;
  searchTerm: string;
  showDarkPool: boolean;
  showBlockTrades: boolean;
  minValue: number;
  maxValue: number;
  minShares: number;
  maxShares: number;
  lookbackDays: number;
  currentPage: number;
  itemsPerPage: number;
  currentLevelsPage: number;
  levelsPerPage: number;
  activeTab: 'trades' | 'levels' | 'summary' | 'heatmap';
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  setSelectedTicker: (ticker: string) => void;
  setSearchTerm: (term: string) => void;
  setShowDarkPool: (show: boolean) => void;
  setShowBlockTrades: (show: boolean) => void;
  setMinValue: (value: number) => void;
  setMaxValue: (value: number) => void;
  setMinShares: (shares: number) => void;
  setMaxShares: (shares: number) => void;
  setLookbackDays: (days: number) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setCurrentLevelsPage: (page: number) => void;
  setLevelsPerPage: (items: number) => void;
  setActiveTab: (tab: 'trades' | 'levels' | 'summary' | 'heatmap') => void;
  
  // Fetch data
  fetchDarkPoolTrades: () => Promise<void>;
  fetchPriceLevels: () => Promise<void>;
  fetchDarkPoolSummary: () => Promise<void>;
  fetchDarkPoolHeatmap: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  
  // Computed values
  getFilteredTrades: () => DarkPoolTrade[];
  getDisplayTrades: () => DarkPoolTrade[];
  getDisplayLevels: () => PriceLevel[];
  getTotalPages: () => number;
  getTotalLevelsPages: () => number;
}

export const useDarkPoolStore = create<DarkPoolState>((set, get) => ({
  // Data
  darkPoolTrades: [],
  priceLevels: null,
  darkPoolSummary: null,
  darkPoolHeatmap: null,
  
  // UI state
  selectedTicker: 'ALL',
  searchTerm: '',
  showDarkPool: true,
  showBlockTrades: true,
  minValue: 0,
  maxValue: 0,
  minShares: 0,
  maxShares: 0,
  lookbackDays: 7,
  currentPage: 1,
  itemsPerPage: 50,
  currentLevelsPage: 1,
  levelsPerPage: 50,
  activeTab: 'trades',
  isLoading: false,
  error: null,
  lastUpdated: null,
  
  // Actions
  setSelectedTicker: (ticker: string) => set({ selectedTicker: ticker }),
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setShowDarkPool: (show: boolean) => set({ showDarkPool: show }),
  setShowBlockTrades: (show: boolean) => set({ showBlockTrades: show }),
  setMinValue: (value: number) => set({ minValue: value }),
  setMaxValue: (value: number) => set({ maxValue: value }),
  setMinShares: (shares: number) => set({ minShares: shares }),
  setMaxShares: (shares: number) => set({ maxShares: shares }),
  setLookbackDays: (days: number) => set({ lookbackDays: days }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setItemsPerPage: (items: number) => set({ itemsPerPage: items }),
  setCurrentLevelsPage: (page: number) => set({ currentLevelsPage: page }),
  setLevelsPerPage: (items: number) => set({ levelsPerPage: items }),
  setActiveTab: (tab: 'trades' | 'levels' | 'summary' | 'heatmap') => set({ activeTab: tab }),
  
  // Fetch data
  fetchDarkPoolTrades: async () => {
    const { 
      selectedTicker, 
      showDarkPool, 
      showBlockTrades, 
      minValue, 
      maxValue, 
      minShares, 
      maxShares, 
      lookbackDays 
    } = get();
    
    set({ isLoading: true, error: null });
    
    try {
      const trades = await getDarkPoolTrades(
        selectedTicker,
        showDarkPool,
        showBlockTrades,
        minValue,
        maxValue,
        minShares,
        maxShares,
        lookbackDays
      );
      
      set({ 
        darkPoolTrades: trades,
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch dark pool trades' 
      });
    }
  },
  
  fetchPriceLevels: async () => {
    const { selectedTicker } = get();
    const ticker = selectedTicker === 'ALL' ? 'AAPL' : selectedTicker;
    
    set({ isLoading: true, error: null });
    
    try {
      const levels = await getPriceLevels(ticker);
      
      set({ 
        priceLevels: levels,
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch price levels' 
      });
    }
  },
  
  fetchDarkPoolSummary: async () => {
    const { selectedTicker } = get();
    const ticker = selectedTicker === 'ALL' ? 'AAPL' : selectedTicker;
    
    set({ isLoading: true, error: null });
    
    try {
      const summary = await getDarkPoolSummary(ticker);
      
      set({ 
        darkPoolSummary: summary,
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch dark pool summary' 
      });
    }
  },
  
  fetchDarkPoolHeatmap: async () => {
    const { selectedTicker } = get();
    const ticker = selectedTicker === 'ALL' ? 'AAPL' : selectedTicker;
    
    set({ isLoading: true, error: null });
    
    try {
      const heatmap = await getDarkPoolHeatmap(ticker);
      
      set({ 
        darkPoolHeatmap: heatmap,
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch dark pool heatmap' 
      });
    }
  },
  
  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await Promise.all([
        get().fetchDarkPoolTrades(),
        get().fetchPriceLevels(),
        get().fetchDarkPoolSummary(),
        get().fetchDarkPoolHeatmap()
      ]);
      
      set({ 
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch dark pool data' 
      });
    }
  },
  
  // Computed values
  getFilteredTrades: () => {
    const { darkPoolTrades, searchTerm } = get();
    
    if (!searchTerm) {
      return darkPoolTrades;
    }
    
    return darkPoolTrades.filter(trade => 
      trade.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
  
  getDisplayTrades: () => {
    const { currentPage, itemsPerPage } = get();
    const filteredTrades = get().getFilteredTrades();
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredTrades.slice(startIndex, endIndex);
  },
  
  getDisplayLevels: () => {
    const { priceLevels, currentLevelsPage, levelsPerPage } = get();
    
    if (!priceLevels) {
      return [];
    }
    
    const startIndex = (currentLevelsPage - 1) * levelsPerPage;
    const endIndex = startIndex + levelsPerPage;
    
    return priceLevels.levels.slice(startIndex, endIndex);
  },
  
  getTotalPages: () => {
    const filteredTrades = get().getFilteredTrades();
    const { itemsPerPage } = get();
    
    return Math.ceil(filteredTrades.length / itemsPerPage);
  },
  
  getTotalLevelsPages: () => {
    const { priceLevels, levelsPerPage } = get();
    
    if (!priceLevels) {
      return 1;
    }
    
    return Math.ceil(priceLevels.levels.length / levelsPerPage);
  }
}));
