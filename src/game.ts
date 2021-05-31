import { FRAME_DURATION, WS_URL } from './constants';
import { IncomingMessage, OutgoingMessage } from './types/message';
import { Prey, User } from './types/common.types';
import * as uuid from 'uuid';
import MouseTracker from './MouseTracker';
import Renderer from './Renderer';
import $ from 'jquery';

export class Game {
  constructor(
    /** 나의 닉네임 */
    private username: string,
    /** 게임 종료 시 콜백 */
    private onFinish: () => void
  ) {}
  /** 웹소켓 커넥션 */
  private connection: WebSocket | null = null;
  /** 나의 id */
  private id: string = '';
  /** 필드에 존재하는 유저들 */
  private users: User[] = [];
  /** 필드에 존재하는 먹이들 */
  private preys: Prey[] = [];

  private intervalId: ReturnType<typeof setTimeout> | null = null;

  start() {
    const { username, handleMessage, sendMessage } = this;

    // 커넥션 생성
    this.id = uuid.v4();
    this.connection = new WebSocket(
      `${WS_URL}?${new URLSearchParams({ id: this.id, username }).toString()}`
    );
    const connection = this.connection;

    // Incoming message handl성
    connection.onmessage = handleMessage;

    // Outgoing message handle
    MouseTracker.start();
    this.intervalId = setInterval(() => {
      const [x, y] = MouseTracker.position;
      console.log(MouseTracker.position);

      sendMessage({
        type: 'POSITION_CHANGED',
        body: { position: { x, y } },
      });
    }, FRAME_DURATION);

    // 키바인딩
    $(document).on('keydown', (e) => e.key === 'q' && this.finish());
  }

  finish() {
    this.users = [];
    this.preys = [];
    this.connection?.close();
    MouseTracker.stop();
    this.intervalId && clearInterval(this.intervalId);
    this.onFinish();
  }

  handleMessage({ data }: MessageEvent) {
    const { finish } = this;
    const message = JSON.parse(data) as IncomingMessage;
    switch (message.type) {
      case 'OBJECTS':
        this.users = message.body.users;
        this.preys = message.body.preys;
        break;
      case 'WAS_MERGED':
        finish();
        break;
      // 애니메이션을 위한 메세지들
      case 'MERGED':
        break;
      case 'JOIN':
        break;
      case 'EATED':
        break;
      case 'SEED':
        break;
    }
    Renderer.render(this);
  }

  sendMessage = (payload: OutgoingMessage) => {
    this.connection?.send(JSON.stringify(payload));
  };
}
