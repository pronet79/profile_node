import { Skill } from '../models/Skill.js';
import { crudController } from './crudFactory.js';
export default crudController(Skill, { label: 'Skill', defaultSort: { category: 1, order: 1 } });
