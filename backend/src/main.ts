import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)
	const PORT = config.getOrThrow('PORT')
	const ORIGIN: string[] = config.getOrThrow('ORIGIN')

	app.setGlobalPrefix('/api') // настройка куки
	app.use(cookieParser())
	app.enableCors({
		origin: ORIGIN,
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	const swagger = new DocumentBuilder()
		.setTitle('CarbonAPI')
		.setDescription('CarbonAPI - это документация по API Carbon Planner')
		.setVersion('0.0.1.0')
		.addTag('Carbon')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, swagger)
	SwaggerModule.setup('api/docs', app, documentFactory)

	await app.listen(PORT).then(() => {
		console.log('Server start on: http://localhost:' + PORT)
	})
}

bootstrap()
