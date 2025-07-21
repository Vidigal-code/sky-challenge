import { Users } from '@/domain/entities/users/user.entity';

export abstract class UserRepository {
  abstract findById(id: number): Promise<Users | null>;
}
