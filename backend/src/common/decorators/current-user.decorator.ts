import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { User } from '@prisma/client'
import type { Request } from 'express'

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest() as Request

		const user = request.user

		return data ? user![data] : user
	}
)
