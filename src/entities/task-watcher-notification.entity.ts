import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Task } from "./task.entity";
import { User } from "./user.entity";

export enum NotificationEventType {
  STATUS_CHANGE = "STATUS_CHANGE",
  PRIORITY_CHANGE = "PRIORITY_CHANGE",
  COMMENT_ADDED = "COMMENT_ADDED",
  TASK_UPDATED = "TASK_UPDATED",
  DUE_DATE_CHANGE = "DUE_DATE_CHANGE"
}

@Entity()
export class TaskWatcherNotification {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false, eager: true })
  user!: User; // Usuario que recibe la notificación

  @ManyToOne(() => Task, { nullable: false, onDelete: "CASCADE", eager: true })
  task!: Task;

  @Column({
    type: "text",
    enum: NotificationEventType
  })
  eventType!: NotificationEventType;

  @Column({ type: "text", nullable: true })
  metadata?: string; // JSON string con información adicional

  @ManyToOne(() => User, { nullable: true, eager: true })
  triggeredBy?: User; // Usuario que generó el cambio

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  readAt?: Date;
}