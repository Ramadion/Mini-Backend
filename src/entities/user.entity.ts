import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Task } from "./task.entity";
import { Team } from "./team.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  rol!: "admin" | "user";

  @ManyToOne(() => Team, (team) => team.users, { nullable: true })
  team?: Team;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];
}

