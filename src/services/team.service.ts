import { Team } from "../entities/team.entity";
import { TeamRepository } from "../repositories/team.repository";
import { UserRepository } from "../repositories/user.repository";

export class TeamService {
  private teamRepo = new TeamRepository();
  private userRepo = new UserRepository();

  async createTeam(name: string): Promise<Team> {
    if (!name || !name.trim()) throw new Error("El nombre del equipo no puede estar vacío");
    return await this.teamRepo.create(name);
  }

  async addUserToTeam(teamId: number, userId: number) {
    const team = await this.teamRepo.findById(teamId);
    if (!team) throw new Error("Equipo no encontrado");

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    return await this.userRepo.assignTeam(userId, team);
  }

  async getTeamById(teamId: number) {
    return await this.teamRepo.findById(teamId);
  }

  async getAllTeams() {
    return await this.teamRepo.getAll();
  }
}
