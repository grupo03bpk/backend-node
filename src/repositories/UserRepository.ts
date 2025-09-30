import { Repository } from 'typeorm';
import  AppDataSource  from '../config/database';
import { User } from '../entities';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
      select: ['id', 'nome', 'username', 'perfil', 'createdAt', 'updatedAt'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      select: ['id', 'nome', 'username', 'perfil', 'createdAt', 'updatedAt'],
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({
      where: { username },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, userData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findWithPagination(page: number, limit: number): Promise<[User[], number]> {
    return this.repository.findAndCount({
      select: ['id', 'nome', 'username', 'perfil', 'createdAt', 'updatedAt'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
