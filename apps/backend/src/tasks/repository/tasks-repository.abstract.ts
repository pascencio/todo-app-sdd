import { CreateTaskDto } from '@/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto';
import { Task } from '@/tasks/entities/task.entity';

export abstract class TasksRepository {
  abstract findAll(): Promise<Task[]>;
  abstract findById(id: string): Promise<Task | null>;
  abstract create(data: CreateTaskDto): Promise<Task>;
  abstract update(id: string, data: UpdateTaskDto): Promise<Task | null>;
  abstract delete(id: string): Promise<Task | null>;
}
