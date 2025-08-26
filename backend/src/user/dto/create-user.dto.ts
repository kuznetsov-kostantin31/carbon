import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
	@ApiProperty({
		example: 'example@mail.com',
		description: 'Почта пользователя'
	})
	email: string

	@ApiProperty({ example: 'dbjekdgqwdhbabcca', description: 'Пароль' })
	password: string
}
