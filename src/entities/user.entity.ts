import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./task.entity";  


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    rol!: "admin" | "user";

    @OneToMany(() => Task, (task) => task.user)
    tasks!: Task[];
}
