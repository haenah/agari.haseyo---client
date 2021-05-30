import * as uuid from 'uuid';
import { WS_URL } from './constants';
import { IncomingMessage } from './types/message';

export function enterGame() {
  const param = new URLSearchParams({
    id: uuid.v4(),
    username: 'haenah',
  });
  const webSocket = new WebSocket(`${WS_URL}?${param.toString()}`);
  webSocket.onmessage = handleMessage;
}

function handleMessage({ data }: MessageEvent) {
  console.log(JSON.parse(data) as IncomingMessage);
}
