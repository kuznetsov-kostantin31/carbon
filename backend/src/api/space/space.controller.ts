import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Put
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'

import { ConnectUserDto } from './dto/connect-user.dto'
import { CreateSpaceDto } from './dto/create-space.dto'
import { UpdateSpaceDto } from './dto/update-space.dto'
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
		return await this.spaceService.create(dto, userId)
	}

	@Get('/get-by-id/:id')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, description: 'Получить по ID' })
	async getById(@Param(':id') id: string) {
		return await this.spaceService.getById(id)
	}

	@Get('/all')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Получить все пространства, в которых есть пользователь'
	})
	async getAll(@CurrentUser('id') userId: string) {
		return await this.spaceService.getAll(userId)
	}

	@Get('/users/:id')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Получить всех пользователей пространства'
	})
	async getUsersById(@Param('id') id: string) {
		return await this.spaceService.getUsersById(id)
	}

	@Put('/connect/:id')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Подключить пользователя в пространство'
	})
	async connect(@Body() dto: ConnectUserDto, @Param('id') id: string) {
		await this.spaceService.connectUserToSpace(dto, id)
		return true
	}

	@Put('/disconnect/:id')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Отключить пользователя из пространства'
	})
	async disconnect(@Body() dto: ConnectUserDto, @Param('id') id: string) {
		await this.spaceService.disconnectUserInSpace(dto, id)
		return true
	}

	@Patch('/:id')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Изменить пространство'
	})
	async update(@Body() dto: UpdateSpaceDto, @Param('id') id: string) {
		return await this.spaceService.update(dto, id)
	}

	@Delete('/:id')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Удалить пространство'
	})
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		await this.spaceService.delete(id, userId)
		return true
	}
}
