import "reflect-metadata";
import { DataSource } from "typeorm";
import {Task} from "../entities/task.entity";
import { User } from "../entities/user.entity";
import { Team } from "../entities/team.entity";

export const AppdataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    synchronize: false,
    logging: true,
    entities: [Task,User,Team],
    migrations: ["src/migrations/*.ts"],
});

