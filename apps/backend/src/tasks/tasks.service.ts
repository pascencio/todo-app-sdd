import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '@/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto';
import { Task } from '@/tasks/entities/task.entity';
import { TasksRepository } from '@/tasks/repository/tasks-repository.abstract';

@Injectable()
export class TasksService {
  constructor(private readonly repo: TasksRepository) {}

  async findAll(): Promise<Task[]> {
    return this.repo.findAll();
  }

  async findById(id: string): Promise<Task> {
    const task = await this.repo.findById(id);
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async create(data: CreateTaskDto): Promise<Task> {
    return this.repo.create(data);
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const task = await this.repo.update(id, data);
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async delete(id: string): Promise<void> {
    const task = await this.repo.delete(id);
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
  }
}

