import * as bcrypt from 'bcrypt';
import { User } from '../../../users/entities/user.entity';
import AppDataSource from '../data-source';

export async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);

  // Verifica se já existem usuários
  const existingUsers = await userRepository.count();
 /*  if (existingUsers > 0) {
    console.log('👥 Usuários já existem no banco de dados');
    return;
  } */

  // Hash da senha padrão para todos os usuários de teste
  const defaultPassword = await bcrypt.hash('123456', 10);

  // Dados iniciais para teste
  const usersData = [
    {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      password: defaultPassword,
      phone: '(11) 99999-9999',
      active: true,
    },
    {
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      password: defaultPassword,
      phone: '(11) 88888-8888',
      active: true,
    },
    {
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      password: defaultPassword,
      phone: '(11) 77777-7777',
      active: false,
    },
  ];

  try {
    const users = userRepository.create(usersData);
    await userRepository.save(users);
    console.log('✅ Usuários criados com sucesso!');
    console.log(`📊 Total: ${users.length} usuários`);
    console.log('🔑 Senha padrão para testes: 123456');
  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error);
    throw error;
  }
} 