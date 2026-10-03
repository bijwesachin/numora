import { CurriculumIndex } from '@/domain/curriculumIndex';
import { grade5Cards } from './grade5/cards';
import { grade5Curriculum } from './grade5/curriculum';

/** The single entry point the app uses to read curriculum content. */
export const curriculum = new CurriculumIndex({ ...grade5Curriculum, cards: grade5Cards });
