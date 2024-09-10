import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterUserDto } from './dto/signup.dto';
import { RpcException } from '@nestjs/microservices';
import { LoginPayloadEvent } from './dto/login.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
}
