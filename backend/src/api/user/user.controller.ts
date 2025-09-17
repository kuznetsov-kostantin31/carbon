import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'

import { UserService } from './user.service'

@ApiTags('Users')
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

	@Get('@me')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, description: 'Профиль' })
	async me(@CurrentUser('id') id: string) {
		console.log(id)

		return 'hui'
	}

	@Get('test')
	async test() {
		return await 'hello world'
	}
}
