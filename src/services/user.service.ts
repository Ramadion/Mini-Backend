import { User } from  "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
    private userRepo = new UserRepository();

    async createUser(name: string, rol: "admin" | "user"): Promise<User> {
        if(!name || !name.trim()) throw new Error("El nombre no puede estar vacio");
        if(rol !== "admin" && rol !== "user") throw new Error("El rol debe ser 'admin' o 'user'");
        return await this.userRepo.create(name,rol);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepo.getAll();
    }

    async findUserById(id:number): Promise<User | null> {
        return await this.userRepo.findById(id);
    }
}