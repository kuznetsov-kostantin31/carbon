import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { getCorsConfig } from './config/cors.config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)
	const logger = new Logger(AppModule.name)

	const port = config.getOrThrow<number>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')

	app.setGlobalPrefix('/api')
	app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')))
	app.enableCors(getCorsConfig(config))

	const swagger = new DocumentBuilder()
		.setTitle('CarbonAPI')
		.setDescription('CarbonAPI - это документация по API Carbon Planner')
		.setVersion('0.0.1.0')
		.addTag('Carbon')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, swagger)
	SwaggerModule.setup('api/docs', app, documentFactory)

	try {
		await app.listen(port)

		logger.log(`Server is running at: ${host}`)
	} catch (error) {
		logger.error(`Failed to start server: ${error.message}`, error)
		process.exit(1)
	}
}

bootstrap()
