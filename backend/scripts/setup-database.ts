import 'reflect-metadata';
import AppDataSource from '../src/shared/database/data-source';

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados...');

  try {
    // Inicializa a conexão
    console.log('📦 Conectando ao banco de dados...');
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Executa as migrações
    console.log('🔄 Executando migrações...');
    await AppDataSource.runMigrations();
    console.log('✅ Migrações executadas com sucesso!');

    // Exibe informações do banco
    const hasPendingMigrations = await AppDataSource.showMigrations();
    console.log(`📊 Migrações pendentes: ${hasPendingMigrations ? 'Sim' : 'Não'}`);

    console.log('🎉 Banco de dados configurado com sucesso!');
    console.log('💡 Para popular com dados de teste, execute: npm run db:seed');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔒 Conexão encerrada');
    }
  }
}

setupDatabase(); 