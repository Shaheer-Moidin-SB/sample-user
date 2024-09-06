import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly users: Map<string, string> = new Map(); // In-memory store for tokens

  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }

  async storeToken(email: string, token: string) {
    await this.client.send('store_token', { email, token }).toPromise();
  }
}
