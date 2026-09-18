import { Certification } from '../models/Certification.js';
import { crudController } from './crudFactory.js';
export default crudController(Certification, { label: 'Certification', publicFilter: { published: true } });
