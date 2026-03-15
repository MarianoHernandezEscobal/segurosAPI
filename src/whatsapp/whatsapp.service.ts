import { Injectable, OnModuleInit } from '@nestjs/common'
import { Client, LocalAuth } from 'whatsapp-web.js'
import * as qrcode from 'qrcode-terminal'

@Injectable()
export class WhatsappService implements OnModuleInit {

  private client: Client

  async onModuleInit() {

    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true
      }
    })

    this.client.on('qr', (qr) => {
      console.log('Escanea el QR con WhatsApp')
      qrcode.generate(qr, { small: true })
    })

    this.client.on('ready', () => {
      console.log('✅ WhatsApp Web conectado')
    })

    await this.client.initialize()

  }

  async sendMessage(phone: string, message: string) {

    const chatId = `${phone}@c.us`

    await this.client.sendMessage(chatId, message)

  }

}