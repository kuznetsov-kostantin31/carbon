import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@HttpCode(201)
	@ApiResponse({ status: 201, description: 'Список пользователей.' })
	getAll() {
		return this.userService.getAll()
	}

	@Post()
	@HttpCode(201)
	@ApiResponse({ status: 201, description: 'создан пользователь' })
	create(@Body() dto: CreateUserDto) {
		return this.userService.create(dto)
	}
}
