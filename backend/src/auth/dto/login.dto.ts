import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

export class LoginRequestDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'example@mail.com',
		description: 'Почта пользователя'
	})
	email: string

	@IsString()
	@MinLength(6)
	@IsNotEmpty()
	@MaxLength(128)
	@ApiProperty({ example: 'dbjekdgqwdhbabcca', description: 'Пароль' })
	password: string
}
