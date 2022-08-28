"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const votes_1 = require("../controllers/votes");
const votesRouter = (0, express_1.Router)();
votesRouter.post("/", votes_1.addVote);
exports.default = votesRouter;
