import { Experience } from '../models/Experience.js';
import { crudController } from './crudFactory.js';
export default crudController(Experience, { label: 'Experience', defaultSort: { order: 1, startDate: -1 } });
