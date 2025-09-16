import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class CreateSpaceDto {
	@ApiProperty({
		example: 'LGS',
		description: 'Название пространства'
	})
	title: string

	@ApiProperty({
		example: 'Пространство компании LGS',
		description: 'Описание пространства'
	})
	@IsOptional()
	description?: string
}
