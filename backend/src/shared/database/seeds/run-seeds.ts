import 'reflect-metadata';
import AppDataSource from '../data-source';
import { seedUsers } from './user.seed';

async function runSeeds() {
  console.log('🌱 Iniciando seeds...');
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('📦 Conexão com banco estabelecida');
    }
    await seedUsers();
    console.log('🎉 Seeds executadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔒 Conexão com banco fechada');
    }
  }
}
runSeeds(); 