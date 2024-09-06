import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });
  await app.startAllMicroservices();
  await app.listen(3005, () =>
    console.log('Invoice service HTTP server is listening on port 3004'),
  );
}
bootstrap();
