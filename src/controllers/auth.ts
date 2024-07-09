// controllers/AuthController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Organization } from '../models/organization';
import { AppDataSource } from '../config/db.config';
import { createJWT } from '../utils/jwt';
import authValidator from '../validators/auth';
import compareHash from '../libs/compareHash';

interface ExtReq extends Request{
    user: User
}

export const register = async (req: Request, res: Response) => {
    try {

        const validateRes = authValidator.validateRegisterPayload(req.body)
        if(validateRes.error)throw Error(validateRes.error.message)
        const { firstName, lastName, email, password, phone } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const organizationRepository = AppDataSource.getRepository(Organization);

        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'Bad request',
                message: 'Email is taken',
                statusCode: 400
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({ firstName, lastName, email, password: hashedPassword, phone });
        const savedUser = await userRepository.save(user);

        const organization = organizationRepository.create({
            userId: savedUser.userId,
            name: `${savedUser.firstName}'s Organization`,
            members: [savedUser]
        });
        await organizationRepository.save(organization);

        const accessToken = await createJWT(user.userId)

        return res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken,
                user: {
                    userId: savedUser.userId,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    email: savedUser.email,
                    phone: savedUser.phone
                }
            }
        });
    } catch (error) {
        return res.status(400).json({
            status: 'Bad request',
            message: 'Registration unsuccessful',
            statusCode: 400
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user || !(await compareHash(password, user.password))) {
            throw new Error('Authentication failed');
        }

        const accessToken = await createJWT(user.userId)

        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                }
            }
        });
    } catch (error) {
        return res.status(401).json({
            status: 'Bad request',
            message: 'Authentication failed',
            statusCode: 401
        });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { userId: id } });
        if (!user || (req as ExtReq).user.userId !== id) {
            throw new Error();
        }

        return res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        return res.status(400).json({
            status: 'Bad request',
            message: 'Failed to retrieve user',
            statusCode: 400
        });
    }
};
