import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";

export class UserController {
  private userRepo = new UserRepository();

  create = async (req: Request, res: Response) => {
    const { name, role } = req.body;
    const user = await this.userRepo.create(name, role);
    res.json(user);
  };

  getAll = async (req: Request, res: Response) => {
    const users = await this.userRepo.getAll();
    res.json(users);
  };
}
