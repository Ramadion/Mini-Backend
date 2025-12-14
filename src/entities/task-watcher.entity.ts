import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { Task } from "./task.entity";
import { User } from "./user.entity";

@Entity()
@Unique(["task", "user"]) // Un usuario solo puede seguir una tarea una vez
export class TaskWatcher {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Task, { nullable: false, onDelete: "CASCADE" })
  task!: Task;

  @ManyToOne(() => User, { nullable: false, eager: true })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}