import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Participant {
  id: string;
  name: string;
  weight: number;
}

const THUMBNAIL_IMAGES = [
  'https://i.pinimg.com/736x/e0/4d/57/e04d5753cf4baa18baa04f38ff2842ce.jpg',
  'https://i.pinimg.com/236x/18/e8/73/18e873f982ada7f275ecac2003421121.jpg',
];

export interface Program {
  id: string;
  name: string;
  thumbnailUrl: string;
  participants: Participant[];
  exclusions: string[];
  ladderResults: string[]; 
  drawSettings: {
    drawCount: number; // 뽑을 개수
    allowDuplicate: boolean; // 중복 허용
  };
  rouletteSettings: {
    spinSpeed: 'fast' | 'normal' | 'slow'; // 회전 속도
    spinDuration: number; // 회전 시간 (초)
  };
  config: {
    removeAfterDraw: boolean;
    skipAnimation: boolean;
    showProbability: boolean;
    keepHistory: boolean;
  };
  history: {
    name: string;
    drawnAt: number;
  }[];
  createdAt: number;
}

interface ProgramState {
  programs: Program[];
  activeProgramId: string | null;
  addProgram: (name: string) => void;
  deleteProgram: (id: string) => void;
  updateProgramName: (programId: string, name: string) => void;
  updateProgramConfig: (programId: string, config: Partial<Program['config']>) => void;
  updateLadderResults: (programId: string, results: string[]) => void;
  updateDrawSettings: (programId: string, settings: Partial<Program['drawSettings']>) => void;
  updateRouletteSettings: (programId: string, settings: Partial<Program['rouletteSettings']>) => void;
  addHistory: (programId: string, name: string) => void;
  clearHistory: (programId: string) => void;
  setActiveProgram: (id: string | null) => void;
  addParticipant: (programId: string, name: string) => void;
  removeParticipant: (programId: string, participantId: string) => void;
  updateParticipantWeight: (programId: string, participantId: string, weight: number) => void;
  addExclusion: (programId: string, name: string) => void;
  removeExclusion: (programId: string, name: string) => void;
  resetProgram: (programId: string) => void;
}

const DEFAULT_CONFIG = {
  removeAfterDraw: false,
  skipAnimation: false,
  showProbability: true,
  keepHistory: true,
};

export const useProgramStore = create<ProgramState>()(
  persist(
    (set) => ({
      programs: [],
      activeProgramId: null,

      addProgram: (name) =>
        set((state) => {
          // 랜덤으로 썸네일 선택
          const randomThumbnail = THUMBNAIL_IMAGES[Math.floor(Math.random() * THUMBNAIL_IMAGES.length)];
          return {
            programs: [
              ...state.programs,
              {
                id: Date.now().toString(),
                name: name || '새로운 프로그램',
                thumbnailUrl: randomThumbnail,
                participants: [],
                exclusions: [],
                ladderResults: [],
                drawSettings: {
                  drawCount: 1,
                  allowDuplicate: false,
                },
                rouletteSettings: {
                  spinSpeed: 'normal',
                  spinDuration: 4,
                },
                config: { ...DEFAULT_CONFIG },
                history: [],
                createdAt: Date.now(),
              },
            ],
          };
        }),

      deleteProgram: (id) =>
        set((state) => ({
          programs: state.programs.filter((p) => p.id !== id),
          activeProgramId: state.activeProgramId === id ? null : state.activeProgramId,
        })),

      updateProgramName: (programId, name) =>
        set((state) => ({
          programs: state.programs.map((p) => {
            // 기존 프로그램에 thumbnailUrl이 없으면 랜덤으로 할당
            const thumbnailUrl = p.thumbnailUrl || THUMBNAIL_IMAGES[parseInt(p.id) % THUMBNAIL_IMAGES.length];
            return p.id === programId 
              ? { ...p, name: name.trim() || '새로운 프로그램', thumbnailUrl } 
              : { ...p, thumbnailUrl };
          }),
        })),

      updateProgramConfig: (programId, config) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? {
                  ...p,
                  config: {
                    ...DEFAULT_CONFIG,
                    ...(p.config || {}),
                    ...config,
                  },
                }
              : p
          ),
        })),

      updateLadderResults: (programId, results) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId ? { ...p, ladderResults: results } : p
          ),
        })),

      updateDrawSettings: (programId, settings) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? {
                  ...p,
                  drawSettings: {
                    drawCount: 1,
                    allowDuplicate: false,
                    ...(p.drawSettings || {}),
                    ...settings,
                  },
                }
              : p
          ),
        })),

      updateRouletteSettings: (programId, settings) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? {
                  ...p,
                  rouletteSettings: {
                    spinSpeed: 'normal',
                    spinDuration: 4,
                    ...(p.rouletteSettings || {}),
                    ...settings,
                  },
                }
              : p
          ),
        })),

      addHistory: (programId, name) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? {
                  ...p,
                  history: [{ name, drawnAt: Date.now() }, ...(p.history || [])].slice(0, 50),
                }
              : p
          ),
        })),

      clearHistory: (programId) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId ? { ...p, history: [] } : p
          ),
        })),

      setActiveProgram: (id) => set({ activeProgramId: id }),

      addParticipant: (programId, name) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? {
                  ...p,
                  participants: [
                    ...p.participants,
                    { id: Date.now().toString(), name, weight: 1 },
                  ],
                }
              : p
          ),
        })),

      removeParticipant: (programId, participantId) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? {
                  ...p,
                  participants: p.participants.filter((part) => part.id !== participantId),
                }
              : p
          ),
        })),

      updateParticipantWeight: (programId, participantId, weight) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? {
                  ...p,
                  participants: p.participants.map((part) =>
                    part.id === participantId ? { ...part, weight } : part
                  ),
                }
              : p
          ),
        })),

      addExclusion: (programId, name) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? { ...p, exclusions: [...new Set([...p.exclusions, name])] }
              : p
          ),
        })),

      removeExclusion: (programId, name) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? { ...p, exclusions: p.exclusions.filter((e) => e !== name) }
              : p
          ),
        })),

      resetProgram: (programId) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === programId
              ? { ...p, participants: [], exclusions: [] }
              : p
          ),
        })),
    }),
    {
      name: 'program-storage',
    }
  )
);
