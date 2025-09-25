import { Request, Response } from "express";
import { UserService } from "../services/user.service";


const userService = new UserService();

export class UserController {
  create = async (req: Request, res: Response) => {
    try {
      // CORRECCIÓN: Usa 'rol' y 'teamId' para que coincidan con el servicio
      const { name, rol, teamId } = req.body;
      const user = await userService.createUser(name, rol, teamId);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
  };
}
