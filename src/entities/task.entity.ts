import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Team } from "./team.entity";
import { HistorialEstado } from "./historial-estado.entity";

export enum EstadoTarea {
  PENDIENTE = "PENDIENTE",
  EN_CURSO = "EN_CURSO", 
  FINALIZADA = "FINALIZADA",
  CANCELADA = "CANCELADA"
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: "text",
    enum: EstadoTarea,
    default: EstadoTarea.PENDIENTE
  })
  estado!: EstadoTarea;

  @Column({
    type: "text",
    default: "media"
  })
  priority!: string;

  @Column({ type: "datetime", nullable: true })
  dueDate?: Date;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user!: User;

  @ManyToOne(() => Team, (team) => team.tasks, { eager: true })
  team!: Team;

  @CreateDateColumn()
  fechaCreacion!: Date;

  @ManyToOne(() => HistorialEstado, (historial) => historial.tarea)
  historialEstados!: HistorialEstado[];
}