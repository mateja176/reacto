import dotenv from 'dotenv';
import { join } from 'path';

const path = join(__dirname, '..', '.env.test');

dotenv.config({ path });
