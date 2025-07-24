import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CreateUsersTable1704000000000 } from './migrations/1704000000000-CreateUsersTable';
import { AddPasswordToUsers1704000000001 } from './migrations/1704000000001-AddPasswordToUsers';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://usuario:senha@localhost:5432/mouts_db',
  entities: [User],
  migrations: [CreateUsersTable1704000000000, AddPasswordToUsers1704000000001],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default AppDataSource; 