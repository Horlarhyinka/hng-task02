// controllers/OrganizationController.ts
import { Request, Response } from 'express';
import { Organization } from '../models/organization';
import { User } from '../models/user';
import { AppDataSource } from '../config/db.config';

interface ExtReq extends Request{
    user: User
}

export const createOrg = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const userId = (req as ExtReq).user.userId;

        const organizationRepository = AppDataSource.getRepository(Organization);
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { userId } });
        if (!user) throw new Error('User not found');

        const organization = organizationRepository.create({
            userId,
            name,
            description,
            members: [user]
        });
        const newOrg = await organizationRepository.save(organization);

        return res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: newOrg
        });
    } catch (error) {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400
        });
    }
};

export const getOrganizations = async (req: Request, res: Response) => {
    try {
        const userId = (req as ExtReq).user.userId;
        const organizationRepository = AppDataSource.getRepository(Organization);

        const organizations = await organizationRepository
            .createQueryBuilder('organization')
            .leftJoinAndSelect('organization.members', 'member')
            .where('member.userId = :userId', { userId })
            .getMany();

        return res.status(200).json({
            status: 'success',
            message: 'Organizations retrieved successfully',
            data: { organizations }
        });
    } catch (error) {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400
        });
    }
};

export const getOrganization = async (req: Request, res: Response) => {
    try {
        const { orgId } = req.params;
        const userId = ( req as ExtReq).user.userId;
        const organizationRepository = AppDataSource.getRepository(Organization);

        const organization = await organizationRepository
            .createQueryBuilder('organization')
            .leftJoinAndSelect('organization.members', 'member')
            .where('organization.orgId = :orgId', { orgId })
            .andWhere('member.userId = :userId', { userId })
            .getOne();

        if (!organization) throw new Error('Organization not found');

        return res.status(200).json({
            status: 'success',
            message: 'Organization retrieved successfully',
            data: organization
        });
    } catch (error) {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400
        });
    }
};

export const getOrganizationMembers = async (req: Request, res: Response) => {
    try {
        const { orgId } = req.params;
        const userId = ( req as ExtReq).user.userId;
        const organizationRepository = AppDataSource.getRepository(Organization);

        const organization = await organizationRepository
            .createQueryBuilder('organization')
            .leftJoinAndSelect('organization.members', 'member')
            .where('organization.orgId = :orgId', { orgId })
            .andWhere('member.userId = :userId', { userId })
            .getOne();

        if (!organization) throw new Error('Organization not found');

        return res.status(200).json({
            status: 'success',
            message: 'Organization retrieved successfully',
            data: organization.members
        });
    } catch (error) {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400
        });
    }
};

export const addMembers = async (req: Request, res: Response) => {
    try {
        const { orgId } = req.params;
        const { userId } = req.body;
        const organizationRepository = AppDataSource.getRepository(Organization);
        const userRepository = AppDataSource.getRepository(User);

        const organization = await organizationRepository.findOne({ where: { orgId }, relations: ['members'] });
        if (!organization) throw new Error('Organization not found');
        if(organization.userId !== (req as ExtReq).user.userId)throw new Error("Unauthorized")

        const user = await userRepository.findOne({ where: { userId } });
        if (!user) throw new Error('User not found');

        organization.members.push(user);
        await organizationRepository.save(organization);

        return res.status(200).json({
            status: 'success',
            message: 'User added to organization successfully'
        });
    } catch (error) {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400
        });
    }
};