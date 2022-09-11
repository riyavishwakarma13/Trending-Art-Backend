import { Router } from "express";
import { addVote } from "../controllers/votes";
const votesRouter = Router();

votesRouter.post("/:id", addVote);

export default votesRouter;
