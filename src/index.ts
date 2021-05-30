import { init } from './init';
import * as uuid from 'uuid';

try {
  init();
  const webSocket = new WebSocket(`ws://localhost:8080?id=${uuid.v4()}&username=haenah`);
  webSocket.onmessage = console.log;
} catch (error) {
  console.error(error);
}
