import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Inject,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterUserDto } from './dto/signup.dto';
import { RpcException } from '@nestjs/microservices';
import { LoginPayloadEvent } from './dto/login.dto';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';
import { AuthFlag } from './decorators/auth-flag.decorator';
@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private authClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('signup')
  async signup(@Body() RegisterUserDto: RegisterUserDto) {
    try {
      return await this.appService.signup(RegisterUserDto);
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  @Post('login')
  async login(@Body() LoginPayloadEvent: LoginPayloadEvent) {
    try {
      return await this.appService.login(LoginPayloadEvent);
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  @Post('admin-suspend-user')
  async adminRevokeUserAccess(@Body() LoginPayloadEvent: LoginPayloadEvent) {
    try {
      return await this.appService.adminRevokeUserAccess(LoginPayloadEvent);
    } catch (oError) {
      throw new HttpException(oError, HttpStatus.FORBIDDEN);
    }
  }

  @Get('get-user-profile/:id')
  @UseGuards(AuthGuard)
  @AuthFlag('privateRoute')
  async getAdminById(@Param('id') LoginPayloadEvent: LoginPayloadEvent) {
    return await this.appService.getUserProfileById(LoginPayloadEvent);
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('authorize_user');
  }
}
