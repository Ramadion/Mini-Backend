
import { AppdataSource } from "../config/data-source";
import { User } from "../entities/user.entity";

export class UserRepository {
  private repo = AppdataSource.getRepository(User);

  async create(name: string, rol: "admin" | "user") {
    const user = this.repo.create({ name, rol });
    return await this.repo.save(user);
  }

  async getAll() {
    return await this.repo.find();
  }

  async findById(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  

}
