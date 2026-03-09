import { Injectable, OnModuleInit } from '@nestjs/common';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  WASocket
} from '@whiskeysockets/baileys';

import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {

  private sock: WASocket;

  async onModuleInit() {
    await this.start();
  }

  async start() {

    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const { version } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      version,
      auth: state,
      browser: ['Ubuntu', 'Chrome', '20.0']
    });

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', (update) => {

      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('📲 Escanea este QR con WhatsApp:\n');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'open') {
        console.log('✅ WhatsApp conectado');
      }

      if (connection === 'close') {

        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        console.log('❌ conexión cerrada');

        if (shouldReconnect) {
          console.log('🔄 reconectando...');
          this.start();
        } else {
          console.log('⚠ sesión cerrada, borra auth_info y vuelve a logear');
        }

      }

    });

  }

  async sendMessage(phone: string, message: string) {

    const jid = `${phone}@s.whatsapp.net`;

    await this.sock.sendMessage(jid, {
      text: message
    });

  }

}