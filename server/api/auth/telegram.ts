// /server/api/auth/telegram.ts

import crypto from 'crypto'
import { defineEventHandler, getQuery, H3Event, createError } from 'h3'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string // Ensure this is set in your .env file

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)

  const { id, hash, ...userData } = query

  if (!id || !hash) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  // Prepare the data_check_string
  const dataCheckString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join('\n')

  // Calculate the HMAC-SHA256 of data_check_string using your bot's token
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  // Compare the calculated hash with the hash in query
  if (hmac !== hash) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Authentication successful, handle user login or registration
  // Here you can create a session, JWT token, etc.
  // For example:
  return { message: 'Authentication successful', user: userData }
})
