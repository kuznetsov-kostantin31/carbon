import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import type { Request, Response } from 'express'
import { UserService } from 'src/api/user/user.service'
import { isDev } from 'src/common/utils/is-dev'
import { ms, StringValue } from 'src/common/utils/ms.util'

import { LoginRequestDto } from './dto/login.dto'
import { RegisterRequestDto } from './dto/register.dto'
import type { JwtPayload } from './interfaces/jwt.interface'

@Injectable()
export class AuthService {
	private readonly JWT_ACCESS_TOKEN_TTL: StringValue
	private readonly JWT_REFRESH_TOKEN_TTL: StringValue
	private readonly COOKIE_DOMAIN: string

	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService
	) {
		this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<StringValue>(
			'JWT_ACCESS_TOKEN_TTL'
		)
		this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<StringValue>(
			'JWT_REFRESH_TOKEN_TTL'
		)
		this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN')
	}

	async register(res: Response, dto: RegisterRequestDto) {
		const { email, password } = dto

		const existUser = await this.userService.getByEmail(email)

		if (existUser) {
			throw new ConflictException(
				'Пользователь с такой почтой уже существует'
			)
		}

		const user = await this.userService.create({
			email,
			password: await hash(password)
		})

		return this.auth(res, user.id)
	}

	async login(res: Response, dto: LoginRequestDto) {
		const { email, password } = dto

		const user = await this.userService.getByEmail(email)

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) {
			throw new NotFoundException('Пользователь не найден')
		}

		return this.auth(res, user.id)
	}

	async refresh(req: Request, res: Response) {
		const refreshToken = req.cookies['refreshToken']

		if (!refreshToken) {
			throw new UnauthorizedException('Недействительный токен')
		}

		const payload: JwtPayload =
			await this.jwtService.verifyAsync(refreshToken)

		if (payload) {
			const user = await this.userService.getById(payload.id)

			if (!user) {
				throw new NotFoundException('Пользователь не найден')
			}

			return this.auth(res, user.id)
		}
	}

	async logout(res: Response) {
		this.setCookie(res, 'refreshToken', new Date(0))
		return true
	}

	async validate(id: string) {
		const user = this.userService.getById(id)

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		return user
	}

	private auth(res: Response, id: string) {
		const { accessToken, refreshToken, refreshTokenExpires } =
			this.generateTokens(id)
		this.setCookie(res, refreshToken, refreshTokenExpires)

		return { accessToken }
	}

	private generateTokens(id: string) {
		const payload: JwtPayload = { id }

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL
		})

		const refreshTokenExpires = new Date(
			Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL)
		)

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL
		})

		return {
			accessToken,
			refreshToken,
			refreshTokenExpires
		}
	}

	private setCookie(res: Response, value: string, expires: Date) {
		res.cookie('refreshToken', value, {
			httpOnly: true,
			domain: this.COOKIE_DOMAIN,
			expires: expires,
			secure: !isDev(this.configService),
			sameSite: isDev(this.configService) ? 'none' : 'lax'
		})
	}
}
