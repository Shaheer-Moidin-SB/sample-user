import { SetMetadata } from '@nestjs/common';

export const AuthFlag = (flag: string) => SetMetadata('authFlag', flag);
