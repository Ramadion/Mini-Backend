import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { AppdataSource } from "../config/data-source";
import { Team } from "../entities/team.entity";

export class UserService {
    private userRepo = new UserRepository();

    async createUser(name: string, rol: "admin" | "user", teamId: number): Promise<User> {
        if (!name || !name.trim()) throw new Error("El nombre no puede estar vacío");

        rol = rol.toLowerCase() as "admin" | "user";
        if (rol !== "admin" && rol !== "user") throw new Error("El rol debe ser 'admin' o 'user'");
        // buscar el equipo
        const teamRepo = AppdataSource.getRepository(Team);
        const team = await teamRepo.findOneBy({ id: teamId });
        if (!team) throw new Error("El equipo no existe");

        // crear usuario asociado al equipo
        return await this.userRepo.create(name, rol, team);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepo.getAll();
    }

    async findUserById(id: number): Promise<User | null> {
        return await this.userRepo.findById(id);
    }
}
