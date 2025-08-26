import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}
	async getAll() {
		return await this.prisma.user.findMany()
	}
	async create(dto: CreateUserDto) {
		return await this.prisma.user.create({
			data: dto
		})
	}
}
