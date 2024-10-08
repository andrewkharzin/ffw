import { Bot, webhookCallback } from 'https://deno.land/x/grammy@v1.30.0/mod.ts'

const token = Deno.env.get('5696672871:AAETCwCFO18bHSmpEDBMcmlY2Z5CORLUHlk')
if (!token) throw new Error('BOT_TOKEN не установлен')

const bot = new Bot(token)

bot.command('start', (ctx) => ctx.reply('Добро пожаловать! Запущен и работаю.'))
bot.command('ping', (ctx) => ctx.reply(`Понг! ${new Date()}`))

const handleUpdate = webhookCallback(bot, 'std/http')

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url)
    if (url.searchParams.get('secret') !== bot.token) {
      return new Response('not allowed', { status: 405 })
    }
    return await handleUpdate(req)
  } catch (err) {
    console.error(err)
  }
  return new Response()
})
