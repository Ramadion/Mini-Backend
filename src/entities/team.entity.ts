import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => User, (user) => user.team)
  users!: User[];

  @OneToMany(() => Task, (task) => task.team)
  tasks!: Task[];
}
