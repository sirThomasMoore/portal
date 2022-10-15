import { User } from './user';

export interface AuthPacket extends User {
  user: User;
  jwt: string;
  expirationCountdown: number;
  expiration: number;
}
