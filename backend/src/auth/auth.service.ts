import { ConflictException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'argon2'
import { PrismaService } from 'src/database/prisma.service'
import { RegisterRequestDto } from './dto/register.dto'
import { JwtPayload } from './interfaces/jwt.interface'

@Injectable()
export class AuthService {
	private readonly JWT_SECRET: string
	private readonly JWT_ACCESS_TOKEN_TTL: string
	private readonly JWT_REFRESH_TOKEN_TTL: string

	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {
		this.JWT_SECRET = configService.getOrThrow<string>('JWT_SECRET')
		this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
			'JWT_ACCESS_TOKEN_TTL'
		)
		this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
			'JWT_REFRESH_TOKEN_TTL'
		)
	}

	async register(dto: RegisterRequestDto) {
		const { email, password } = dto

		const existUser = await this.prisma.user.findUnique({
			where: {
				email
			}
		})

		if (existUser) {
			throw new ConflictException(
				'Пользователь с такой почтой уже существует'
			)
		}

		const user = await this.prisma.user.create({
			data: {
				email,
				password: await hash(password)
			}
		})

		return this.generateTokens(user.id)
	}

	private generateTokens(id: string) {
		const payload: JwtPayload = { id }

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL
		})

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL
		})

		return {
			accessToken,
			refreshToken
		}
	}
}
