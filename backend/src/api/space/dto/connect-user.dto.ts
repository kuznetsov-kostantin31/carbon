import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ConnectUserDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'example@mail.com',
		description: 'Почта пользователя'
	})
	email: string
}
