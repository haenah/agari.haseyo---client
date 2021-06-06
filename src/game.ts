import { FRAME_DURATION, WS_URL } from './constants';
import { IncomingMessage, OutgoingMessage } from './types/message';
import { Prey, User } from './types/common.types';
import * as uuid from 'uuid';
import MouseTracker from './MouseTracker';
import Renderer from './Renderer';
import { distance } from './utils/math';

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
  users: User[] = [];
  /** 필드에 존재하는 먹이들 */
  preys: Prey[] = [];

  private intervalId: ReturnType<typeof setTimeout> | null = null;

  start = () => {
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

      sendMessage({
        type: 'POSITION_CHANGED',
        body: { position: { x, y } },
      });
    }, FRAME_DURATION);

    // 키바인딩
    document.addEventListener('keydown', this.bindKeys);
  };

  finish = () => {
    this.users = [];
    this.preys = [];
    this.connection?.close();
    MouseTracker.stop();
    this.intervalId && clearInterval(this.intervalId);
    document.removeEventListener('keydown', this.bindKeys);
    this.onFinish();
  };

  handleMessage = ({ data }: MessageEvent) => {
    const { checkEat, finish } = this;
    const message = JSON.parse(data) as IncomingMessage;
    switch (message.type) {
      case 'OBJECTS':
        this.users = message.body.users;
        this.preys = message.body.preys;
        checkEat();
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
  };

  sendMessage = (payload: OutgoingMessage) => {
    this.connection?.send(JSON.stringify(payload));
  };

  bindKeys = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'q':
        this.finish();
    }
  };

  checkEat = () => {
    const { id, users, preys, sendMessage } = this;
    const me = users.find((user) => user.id === id)!;
    const eatenPrey = preys.find((prey) => distance(me, prey) < me.radius);
    if (eatenPrey) {
      sendMessage({ type: 'EAT', body: { prey_id: eatenPrey.id } });
      return;
    }
    const overlaidUser = users.find((user) => distance(me, user) < me.radius);
    if (overlaidUser && overlaidUser.radius < me.radius) {
      sendMessage({ type: 'MERGE', body: { colony_id: overlaidUser.id } });
      return;
    }
  };
}
