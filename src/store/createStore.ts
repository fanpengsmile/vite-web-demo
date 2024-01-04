import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { State } from './initialState';
import { initialState } from './initialState';

interface Action {
  setMenuCollapsed: (val: boolean) => void;
  setIsShowBreadcrumb: (val: boolean) => void;
  setCurrentStaffName: (val: string) => void;
  setEnterPrisePanshiAuth: (val: any) => void;
  setFollower: (val: string) => void;
}

export type Store = State & Action;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,
      setMenuCollapsed: (menuCollapsed) => {
        set({ menuCollapsed });
      },
      setIsShowBreadcrumb: (isShowBreadcrumb) => {
        set({ isShowBreadcrumb });
      },
      setCurrentStaffName: (currentStaffName) => {
        set({ currentStaffName });
      },
      setEnterPrisePanshiAuth: (initEnterpriseState) => {
        set({ initEnterpriseState });
      },
      setFollower: (follower) => {
        set({ follower });
      },
    }),
    {
      name: 'opc-web-storage',
      partialize: (state) => ({ follower: state.follower }),
    },
  ),
);
