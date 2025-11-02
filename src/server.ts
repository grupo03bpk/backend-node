import { config } from 'dotenv';
import app from './app';
import  AppDataSource  from './config/database';

// Carregar variáveis de ambiente
config();

const PORT = process.env.PORT || 3000;
const PUBLIC_PORT = process.env.PUBLIC_PORT || PORT;

async function startServer() {
  try {
    // Inicializar conexão com banco de dados
    console.log('🔄 Conectando ao banco de dados...');
    await AppDataSource.initialize();
    console.log('✅ Banco de dados conectado com sucesso!');

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta interna ${PORT}`);
      console.log(`📚 Documentação disponível em: http://localhost:${PUBLIC_PORT}/api-docs`);
      console.log(`🏥 Health check disponível em: http://localhost:${PUBLIC_PORT}/api/health`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n📴 Recebido sinal ${signal}. Encerrando servidor...`);
      
      server.close(async () => {
        console.log('🔄 Fechando conexão com banco de dados...');
        
        try {
          await AppDataSource.destroy();
          console.log('✅ Conexão com banco de dados encerrada.');
          console.log('👋 Servidor encerrado com sucesso!');
          process.exit(0);
        } catch (error) {
          console.error('❌ Erro ao encerrar conexão com banco:', error);
          process.exit(1);
        }
      });
    };

    // Event listeners para graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Event listener para uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    // Event listener para unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar aplicação
startServer();
