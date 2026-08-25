import { Service } from '../models/Service.js';
import { crudController } from './crudFactory.js';
export default crudController(Service, { label: 'Service', publicFilter: { published: true } });
