import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '@/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto';
import { Task } from '@/tasks/entities/task.entity';
import { TasksRepository } from '@/tasks/repository/tasks-repository.abstract';

@Injectable()
export class TypeOrmTasksRepository extends TasksRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {
    super();
  }

  async findAll(): Promise<Task[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Task | null> {
    return this.repo.findOneBy({ id });
  }

  async create(data: CreateTaskDto): Promise<Task> {
    return this.repo.save(data);
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task | null> {
    const task = await this.findById(id);
    if (!task) return null;
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<Task | null> {
    const task = await this.findById(id);
    if (!task) return null;
    await this.repo.delete(id);
    return task;
  }
}
