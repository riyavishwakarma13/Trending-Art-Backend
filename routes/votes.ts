import { Router } from "express";
import { addVote } from "../controllers/votes";
import {over} from "../middleware/over";
const votesRouter = Router();

votesRouter.post("/:id", over, addVote);

export default votesRouter;
