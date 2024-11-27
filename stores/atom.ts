import { Board, Todo, User } from '@/types';
import { atomWithStorage } from "jotai/utils";
import {atom} from 'jotai';

/** supabase에 저장되어 있는 table 내에 있는 모든 데이터 조회 */

/** 전체 todo 목록 조회 */
export const todosAtom = atom<Todo[]>([]);

/* 단일 개별 Todo 상태 */
export const boardAtom = atom<Board[]>([]);

export const userAtom = atomWithStorage<User | null>("user", null);