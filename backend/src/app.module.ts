import {
	type MiddlewareConsumer,
	Module,
	type NestModule
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ApiModule } from './api/api.module'
import { InfraModule } from './infra/infra.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		InfraModule,
		ApiModule
	],
	controllers: [],
	providers: []
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply((req, res, next) => {
				console.log(`Request: ${req.method} ${req.url}`)
				next()
			})
			.forRoutes('*')
	}
}
