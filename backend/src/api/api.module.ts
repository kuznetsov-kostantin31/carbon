import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { SpaceModule } from './space/space.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [AuthModule, UserModule, SpaceModule]
})
export class ApiModule {}
