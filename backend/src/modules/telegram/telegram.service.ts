const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`;

export const handleIncomingUpdate = async (update: any) => {
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    // Aquí guardas en DB o envías al frontend
    // await saveMessageToDB({ chatId, text, source: "telegram" });
    // notifyFrontend(chatId, text);

    // Ejemplo: auto respuesta
    // await sendTextMessage(chatId, `Recibí: ${text}`);
  }
};

export const sendTextMessage = async (chatId: number | string, text: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const url = `${TELEGRAM_API(token)}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  return response.json();
};
