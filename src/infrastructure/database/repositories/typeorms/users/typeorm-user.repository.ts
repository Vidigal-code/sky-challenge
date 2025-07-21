import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@/domain/entities/users/user.entity';
import { UserRepository } from '@/domain/repositories/users/user.repository';

@Injectable()
export class TypeormUserRepository implements UserRepository {
  constructor(
    @InjectRepository(Users)
    private readonly ormRepository: Repository<Users>
  ) {}

  async findById(id: number): Promise<Users | null> {
    return this.ormRepository.findOneBy({ id });
  }
}
