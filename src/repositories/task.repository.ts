import { AppdataSource } from "../config/data-source";
import { Task, TaskState } from "../entities/task.entity";
import { Team } from "../entities/team.entity";
export class TaskRepository {
  private repo = AppdataSource.getRepository(Task);

  async create(title: string, description: string,state: TaskState ,teamId: number) {
    const teamRepo = AppdataSource.getRepository(Team);
    const team = await teamRepo.findOneBy({ id: teamId });
    if (!team) throw new Error("El equipo no existe");

    const task = this.repo.create({ title, description, state ,team });
    return await this.repo.save(task);
  }

  async createUserTask(title: string, description: string, state: TaskState, userId: number) {
    const userRepo = AppdataSource.getRepository("User");
    const user = await userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("El usuario no existe"); 
    const task = this.repo.create({ title, description, state, user});
    return await this.repo.save(task);
  }


  async getAllTasks() {
    return await this.repo.find({ relations: ["team", "user"] });
  }
  

  async markState(id: number, state: TaskState) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) throw new Error("La tarea no existe");
    task.state = state;
    return await this.repo.save(task);
  }


  async getTasksByTeamId(teamId: number) {
    return await this.repo.find({ where: { team: { id: teamId } }, 
      relations: ["team", "user"] 
    });
  }

  async getTasksByUserId(userId: number) {
    return await this.repo
  }


  async findOneById(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ["team"] });
  }

  async deleteTask(id: number) {
    await this.repo.delete(id);
  }

  async updateTask(id: number, data: Partial<Task>) {
  const task = await this.repo.findOne({ where: { id } });
  if (!task) throw new Error("La tarea no existe");

  Object.assign(task, data);
  return await this.repo.save(task);
}

}
