import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // 启用 CORS
    app.enableCors({
      origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3001').split(','),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // 全局路由前缀（可选）
    // app.setGlobalPrefix('api');

    // 全局日志中间件
    app.use((req, res, next) => {
      logger.log(`${req.method} ${req.originalUrl}`);
      next();
    });

    const port = configService.get<number>('PORT', 3000);
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`);
  }
}

bootstrap();