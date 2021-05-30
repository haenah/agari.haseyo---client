import { FRAME_DURATION, WS_URL } from './constants';
import { IncomingMessage, OutgoingMessage } from './types/message';
import { Prey, User } from './types/common.types';
import * as uuid from 'uuid';
import $ from 'jquery';

enum MouseTrackerState {
  ON,
  OFF,
}
class MouseTracker {
  private state: MouseTrackerState = MouseTrackerState.OFF;
  /** x, y */
  position: [number, number] = [0, 0];
  start() {
    this.state === MouseTrackerState.OFF &&
      $('#game').get(0).addEventListener('mousemove', this.updatePosition);
  }
  stop() {
    this.state === MouseTrackerState.ON &&
      $('#game').get(0).removeEventListener('mousemove', this.updatePosition);
  }
  updatePosition(e: MouseEvent) {
    console.log(this);
    
    this.position = [e.offsetX, e.offsetY];
  }
}

const mouseTracker = new MouseTracker();

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
  private id: string | null = null;
  /** 필드에 존재하는 유저들 */
  private users: User[] = [];
  /** 필드에 존재하는 먹이들 */
  private preys: Prey[] = [];

  private intervalId: ReturnType<typeof setTimeout> | null = null;

  start() {
    const { id, username, handleMessage, sendMessage } = this;
    this.id = uuid.v4();
    this.connection = new WebSocket(
      `${WS_URL}?${new URLSearchParams({ id: this.id, username: this.username }).toString()}`
    );
    const connection = this.connection;
    connection.onmessage = this.handleMessage;
    this.intervalId = setInterval(function () {
      const [x, y] = mouseTracker.position;
      sendMessage({
        type: 'POSITION_CHANGED',
        body: { position: { x, y } },
      });
    }, FRAME_DURATION);
  }

  finish() {
    this.id = null;
    this.users = [];
    this.preys = [];
    this.connection?.close();
    this.onFinish();
  }

  handleMessage({ data }: MessageEvent) {
    const { render, finish } = this;
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
    render();
  }

  sendMessage = (payload: OutgoingMessage) => {
    this.connection?.send(JSON.stringify(payload));
  };

  render() {}
}
