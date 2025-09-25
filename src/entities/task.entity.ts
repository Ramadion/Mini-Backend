import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Team } from "./team.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user!: User;

  @ManyToOne(() => Team, (team) => team.tasks, { eager: true })
  team!: Team;
}
