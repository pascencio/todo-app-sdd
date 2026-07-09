import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@/tasks/entities/task.entity';
import { TasksController } from '@/tasks/tasks.controller';
import { TasksService } from '@/tasks/tasks.service';
import { TasksRepository } from '@/tasks/repository/tasks-repository.abstract';
import { TypeOrmTasksRepository } from '@/tasks/repository/typeorm-tasks.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [
    TasksService,
    { provide: TasksRepository, useClass: TypeOrmTasksRepository },
  ],
})
export class TasksModule {}
