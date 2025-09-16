import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/common/decorators/auth.decorator'

import { UserService } from './user.service'

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/:spaceId')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Получить пользователей за пространство'
	})
	async getBySpace(@Param(':spaceId') spaceId: string) {
		return await this.userService.getBySpace(spaceId)
	}
}
