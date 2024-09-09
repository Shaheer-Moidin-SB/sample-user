import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SessionRedisService } from './session/session.redis.service';
@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'AUTHENTICATE_SERVICE',
    //     transport: Transport.REDIS,
    //     options: {
    //       host: 'localhost',
    //       port: 6379,
    //     },
    //   },
    // ]),
    PassportModule,
    JwtModule.register({
      secret: 'my_secret', // Should be in .env
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SessionRedisService],
  exports: [AppService],
})
export class AppModule {}
