import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { LoginRequestDto } from './dto/login.dto'
import { RegisterRequestDto } from './dto/register.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/register')
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({ status: HttpStatus.CREATED, description: 'Регистрация' })
	async register(
		@Body() dto: RegisterRequestDto,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.register(res, dto)
	}

	@Post('/login')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, description: 'Авторизация' })
	async login(
		@Body() dto: LoginRequestDto,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.login(res, dto)
	}

	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, description: 'Новый токен' })
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.refresh(req, res)
	}

	@Post('/logout')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, description: 'Выход из аккаунта' })
	async logout(@Res({ passthrough: true }) res: Response) {
		return await this.authService.logout(res)
	}
}
