import { BOARD_HEIGHT, BOARD_WIDTH, SPEED, TICK_INTERVAL, WS_URL } from './constants';
import { IncomingMessage, OutgoingMessage } from './types/message';
import { Position, Prey, User } from './types/common.types';
import * as uuid from 'uuid';
import MouseTracker from './MouseTracker';
import Renderer from './Renderer';
import { abs, distance } from './utils/math';
import { canvas } from '.';

export class Game {
  constructor(
    /** 나의 닉네임 */
    private username: string,
    /** 게임 종료 시 콜백 */
    private onFinish: () => void
  ) {
    this.renderer = new Renderer(this);
  }
  /** 웹소켓 커넥션 */
  private connection: WebSocket | null = null;
  /** 렌더러 */
  private renderer: Renderer;
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
      const { users, id } = this;
      const me = users.find((user) => user.id === id);
      if (!me) return;
      const [x, y] = MouseTracker.position;
      const vector: Position = { x: x - canvas.clientWidth / 2, y: y - canvas.clientHeight / 2 };
      const absVector = abs(vector);
      const next: Position = {
        x: me.position.x + (SPEED * vector.x) / absVector,
        y: me.position.y + (SPEED * vector.y) / absVector,
      };

      sendMessage({
        type: 'POSITION_CHANGED',
        body: {
          position: next,
        },
      });
    }, TICK_INTERVAL);

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
    const { renderer, checkEat, finish } = this;
    const message = JSON.parse(data) as IncomingMessage;
    switch (message.type) {
      case 'JOIN':
        this.users = [message.body.new_user];
        break;
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
    renderer.render();
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
    const eatenPrey = preys.find((prey) => distance(me.position, prey.position) < me.radius);
    if (eatenPrey) {
      sendMessage({ type: 'EAT', body: { prey_id: eatenPrey.id } });
      return;
    }
    const overlaidUser = users.find((user) => distance(me.position, user.position) < me.radius);
    if (overlaidUser && overlaidUser.radius < me.radius) {
      sendMessage({ type: 'MERGE', body: { colony_id: overlaidUser.id } });
      return;
    }
  };
}
