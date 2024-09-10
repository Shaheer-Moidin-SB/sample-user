import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    try {
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
    } catch (oError) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
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

  async adminRevokeUserAccess(LoginPayloadEvent: LoginPayloadEvent) {
    try {
      const user = this.users.get(LoginPayloadEvent.email);
      const updateUser = { ...user };
      if (!user)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      updateUser.isValid = false;
      this.users.set(LoginPayloadEvent.email, updateUser);
      const redisResponded = await this.redisService.addToBlacklist(
        updateUser.userId,
        updateUser.token,
      );
      return redisResponded;
    } catch (oError) {
      throw new HttpException(oError, HttpStatus.FORBIDDEN);
    }
  }
}
