import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/infra/database/prisma.service'

import { UserService } from '../user/user.service'

import { ConnectUserDto } from './dto/connect-user.dto'
import { CreateSpaceDto } from './dto/create-space.dto'
import { UpdateSpaceDto } from './dto/update-space.dto'

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
				},
				editor: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async getById(id: string) {
		return await this.prisma.space.findFirst({
			where: { id },
			include: {
				users: true
			}
		})
	}

	async getUsersById(id: string) {
		return await this.prisma.space.findUnique({
			where: { id },
			include: {
				users: true
			}
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
			},
			include: {
				users: true
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

	async disconnectUserInSpace(dto: ConnectUserDto, id: string) {
		return await this.prisma.space.update({
			where: { id },
			data: {
				users: {
					disconnect: {
						email: dto.email
					}
				}
			},
			include: {
				users: true
			}
		})
	}

	async update(dto: Partial<UpdateSpaceDto>, id: string) {
		return await this.prisma.space.update({
			where: { id },
			data: {
				title: dto.title,
				description: dto.description
			}
		})
	}

	async delete(id: string, userId: string) {
		const editor = await this.prisma.space.findFirst({
			where: {
				id,
				editor: {
					some: {
						id: userId
					}
				}
			}
		})

		if (!editor) {
			throw new UnauthorizedException('Вы не редактор пространства')
		}

		return await this.prisma.space.delete({
			where: {
				id,
				editor: {
					some: {
						id: userId
					}
				}
			}
		})
	}
}
