import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'

import { ConnectUserDto } from './dto/connect-user.dto'
import { CreateSpaceDto } from './dto/create-space.dto'
import { SpaceService } from './space.service'

@ApiTags('Spaces')
@Controller('space')
export class SpaceController {
	constructor(private readonly spaceService: SpaceService) {}

	@Post('/create')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, description: 'Создать пространство' })
	async create(
		@CurrentUser('id') userId: string,
		@Body() dto: CreateSpaceDto
	) {
		return this.spaceService.create(dto, userId)
	}

	@Get('/get-by-id/:id')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, description: 'Получить по ID' })
	async getById(@Param(':id') id: string) {
		return this.spaceService.getById(id)
	}

	@Get()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Получить все пространства'
	})
	async getAll(@CurrentUser('id') userId: string) {
		return this.spaceService.getAll(userId)
	}

	@Put('/connect/:id')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Подключить пользователя в пространство'
	})
	async connect(@Body() dto: ConnectUserDto, @Param('id') id: string) {
		return this.spaceService.connectUserToSpace(dto, id)
	}

	@Put('/disconnect/:id')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Отключить пользователя из пространства'
	})
	async disconnect(@Body() dto: ConnectUserDto, @Param('id') id: string) {
		return this.spaceService.disconnectUserInSpace(dto, id)
	}
}
