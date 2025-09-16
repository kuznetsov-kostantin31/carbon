import { Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'

import { SpaceController } from './space.controller'
import { SpaceService } from './space.service'

@Module({
	controllers: [SpaceController],
	providers: [SpaceService],
	imports: [UserModule]
})
export class SpaceModule {}
