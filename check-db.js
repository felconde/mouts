const axios = require('axios');

async function checkDatabase() {
  try {
    console.log('🔍 Verificando se o banco está configurado...');
    
    // Teste de login com dados conhecidos
    const loginData = {
      email: 'joao.silva@email.com',
      password: '123456'
    };
    
    console.log('📝 Tentando login com:', loginData.email);
    
    const response = await axios.post('http://localhost:3001/auth/login', loginData, {
      timeout: 10000,
      validateStatus: () => true
    });
    
    console.log('📊 Status da resposta:', response.status);
    
    if (response.status === 200) {
      console.log('✅ Login bem-sucedido!');
      console.log('👤 Usuário:', response.data.user.name);
    } else if (response.status === 401) {
      console.log('❌ Credenciais inválidas');
      console.log('📄 Resposta:', response.data);
    } else if (response.status === 500) {
      console.log('❌ Erro interno do servidor');
      console.log('📄 Resposta:', response.data);
    } else {
      console.log('❓ Status inesperado:', response.status);
      console.log('📄 Resposta:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar banco:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   - Backend não está rodando');
      console.error('   - Execute: cd backend && npm run start:dev');
    } else if (error.response) {
      console.error('   - Status:', error.response.status);
      console.error('   - Dados:', error.response.data);
    } else {
      console.error('   -', error.message);
    }
  }
}

checkDatabase(); 