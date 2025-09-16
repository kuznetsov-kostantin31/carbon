import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/database/prisma.service'

import { UserService } from '../user/user.service'

import { ConnectUserDto } from './dto/connect-user.dto'
import { CreateSpaceDto } from './dto/create-space.dto'

@Injectable()
export class SpaceService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService
	) {}

	async create(dto: CreateSpaceDto, userId: string) {
		return await this.prisma.space.create({
			data: {
				...dto,
				users: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async getById(id: string) {
		return await this.prisma.space.findFirst({
			where: { id }
		})
	}

	async getAll(userId: string) {
		return await this.prisma.space.findMany({
			where: {
				users: {
					some: {
						id: userId
					}
				}
			}
		})
	}

	async connectUserToSpace(dto: ConnectUserDto, id: string) {
		return await this.prisma.space.update({
			where: { id },
			data: {
				users: {
					connect: {
						email: dto.email
					}
				}
			},
			include: {
				users: true
			}
		})
	}

	async deleteUserInSpace(dto: ConnectUserDto, id: string) {
		// return this.prisma.space.({
		// 	where: {id},
		// 	data: {
		// 	}
		// })
	}
}
