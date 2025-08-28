import { Injectable } from '@nestjs/common'
import { RegisterRequestDto } from 'src/auth/dto/register.dto'
import { PrismaService } from 'src/database/prisma.service'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}
	async getAll() {
		return await this.prisma.user.findMany()
	}

	async create(dto: RegisterRequestDto) {
		return await this.prisma.user.create({
			data: dto
		})
	}

	async getByEmail(email: string) {
		return await this.prisma.user.findUnique({
			where: {
				email
			},
			select: {
				id: true,
				password: true
			}
		})
	}

	async getById(id: string) {
		return await this.prisma.user.findUnique({
			where: { id }
		})
	}
}
