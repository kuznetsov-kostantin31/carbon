import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)
	const PORT = config.getOrThrow('PORT')
	const ORIGIN: string[] = config.getOrThrow('ORIGIN')

	app.setGlobalPrefix('api') // настройка куки
	app.use(cookieParser())
	app.enableCors({
		origin: ORIGIN,
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	await app.listen(PORT)
}

bootstrap()
