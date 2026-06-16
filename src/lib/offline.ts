import Dexie, { type Table } from 'dexie';

export interface SubjectPack {
  id: string;
  name: string;
  category: string;
  gradeLevel: string;
  topicsCount: number;
  downloadedAt: Date;
  content: string; // JSON string of complete pack details
}

export interface OfflineAction {
  id?: number;
  actionType: 'quiz_submit' | 'goal_complete' | 'streak_update';
  payload: string; // JSON payload
  timestamp: number;
}

class StudyPilotDatabase extends Dexie {
  subjectPacks!: Table<SubjectPack, string>;
  offlineQueue!: Table<OfflineAction, number>;

  constructor() {
    super('StudyPilotDB');
    this.version(1).stores({
      subjectPacks: 'id, name, category, gradeLevel',
      offlineQueue: '++id, actionType, timestamp',
    });
  }
}

export const db = new StudyPilotDatabase();
