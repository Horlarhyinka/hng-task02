import { Router } from "express";
import { createOrg, getOrganization, getOrganizations, addMembers } from "../controllers/organization";
import { authMiddleware } from "../middlewares/auth";

const router = Router()

router.post('/', authMiddleware, createOrg);
router.get('/', authMiddleware, getOrganizations);
router.get('/:orgId', authMiddleware, getOrganization);
router.post('/:orgId/users', authMiddleware, addMembers);
router.get('/:orgId/users', authMiddleware, addMembers);

export default router