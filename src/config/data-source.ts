import "reflect-metadata";
import { DataSource } from "typeorm";
import {Task} from "../entities/task.entity";

export const AppdataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    synchronize: true,
    entities: [Task],
});

