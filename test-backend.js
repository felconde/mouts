const axios = require('axios');

async function testBackend() {
  try {
    console.log('🔍 Testando conexão com o backend...');
    
    // Teste básico de conectividade
    const response = await axios.get('http://localhost:3001/auth/me', {
      timeout: 5000,
      validateStatus: () => true // Aceita qualquer status
    });
    
    console.log('✅ Backend está respondendo!');
    console.log('📊 Status:', response.status);
    
    if (response.status === 401) {
      console.log('ℹ️  Status 401 é esperado - endpoint protegido');
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o backend:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   - Backend não está rodando');
      console.error('   - Execute: cd backend && npm run start:dev');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   - Não foi possível resolver localhost:3001');
    } else {
      console.error('   -', error.message);
    }
  }
}

testBackend(); 