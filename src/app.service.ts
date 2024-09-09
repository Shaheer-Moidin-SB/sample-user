import { Injectable } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
import { RegisterUserDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { SessionRedisService } from './session/session.redis.service';
import { JwtService } from '@nestjs/jwt';
import { LoginPayloadEvent } from './dto/login.dto';
@Injectable()
export class AppService {
  private readonly users = new Map<string, any>(); // In-memory store for users

  constructor(
    private jwtService: JwtService,
    private redisService: SessionRedisService,
    // @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async signup(RegisterUserDto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(RegisterUserDto.password, 10);
    const userId = Date.now().toString();

    const token = this.jwtService.sign({ userId });

    const user = {
      email: RegisterUserDto.email,
      userId,
      username: RegisterUserDto.username,
      password: hashedPassword,
      token: token,
    };

    this.users.set(RegisterUserDto.email, user);
    // await this.redisService.setSession(userId, token);
    return user;
  }

  async login(LoginPayloadEvent: LoginPayloadEvent): Promise<string | null> {
    const user = this.users.get(LoginPayloadEvent.email);
    if (!user) {
      // const redisCleared = await this.redisService.clearAllData();
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      LoginPayloadEvent.password,
      user.password,
    );
    if (!isPasswordValid) return null;

    const redisResponded = await this.redisService.setSession(
      user.userId,
      user.token,
    );
    console.log(redisResponded);
    return user;
  }
}
