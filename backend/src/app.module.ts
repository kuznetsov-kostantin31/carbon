import {
	type MiddlewareConsumer,
	Module,
	type NestModule
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggingMiddleware } from './common/middleware/logger.middleware'
import { DatabaseModule } from './database/database.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		DatabaseModule,
		UserModule,
		AuthModule
	],
	controllers: [],
	providers: []
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes('*')
	}
}
