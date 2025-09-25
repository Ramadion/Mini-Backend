import { AppdataSource } from "../config/data-source";
import { Team } from "../entities/team.entity";

export class TeamRepository {
  private repo = AppdataSource.getRepository(Team);

  async create(name: string) {
    const team = this.repo.create({ name });
    return await this.repo.save(team);
  }

  async findById(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ["users"] });
  }

  async getAll() {
    return await this.repo.find({ relations: ["users"] });
  }
}
