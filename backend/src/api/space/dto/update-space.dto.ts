import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateSpaceDto {
	@ApiProperty({
		example: 'LGS',
		description: 'Название пространства'
	})
	@IsNotEmpty()
	title: string

	@ApiProperty({
		example: 'Пространство компании LGS',
		description: 'Описание пространства'
	})
	@IsOptional()
	description: string
}
