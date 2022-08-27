import { Router } from "express";
import { addVote } from "../controllers/votes";

const votesRouter = Router();

votesRouter.post("/", addVote);

export default votesRouter;
