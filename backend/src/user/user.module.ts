import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [DatabaseModule],
	exports: [UserService]
})
export class UserModule {}
