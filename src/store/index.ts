import create from 'zustand';
import { Project, Transaction, Flock } from '@types/index';

interface AppState {
  // Project
  project: Project | null;
  setProject: (project: Project) => void;

  // Flock
  flock: Flock | null;
  setFlock: (flock: Flock) => void;
  updateFlockCount: (count: number) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  setTransactions: (transactions: Transaction[]) => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  project: null,
  setProject: (project) => set({ project }),

  flock: null,
  setFlock: (flock) => set({ flock }),
  updateFlockCount: (count) =>
    set((state) => ({
      flock: state.flock ? { ...state.flock, currentCount: count } : null,
    })),

  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
    })),
  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? transaction : t)),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  setTransactions: (transactions) => set({ transactions }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  error: null,
  setError: (error) => set({ error }),
}));
