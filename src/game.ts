import { SPEED, TICK_INTERVAL, WS_URL } from './constants';
import { IncomingMessage, OutgoingMessage } from './types/message';
import { Prey, User } from './types/common.types';
import * as uuid from 'uuid';
import MouseTracker from './MouseTracker';
import Renderer from './Renderer';
import { abs, distanceSquare, linearComb, minus } from './utils/vector';
import { getClientCenter, resizeCanvasHandler } from './utils/canvas';

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
  /** 자기 자신 */
  me: User | undefined;

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

    // Canvas resizer
    resizeCanvasHandler();
    window.addEventListener('resize', resizeCanvasHandler);

    // Outgoing message handle
    MouseTracker.start();
    this.intervalId = setInterval(() => {
      const { me } = this;
      if (!me) return;
      const vector = minus(MouseTracker.position, getClientCenter());
      const nextPosition = linearComb(me.position, 1, vector, SPEED / abs(vector));

      sendMessage({
        type: 'POSITION_CHANGED',
        body: {
          position: nextPosition,
        },
      });
    }, TICK_INTERVAL);

    // 키바인딩
    document.addEventListener('keydown', this.bindKeys);
  };

  finish = () => {
    this.users = [];
    this.preys = [];
    this.me = undefined;
    this.connection?.close();
    MouseTracker.stop();
    this.intervalId && clearInterval(this.intervalId);
    document.removeEventListener('keydown', this.bindKeys);
    window.removeEventListener('resize', resizeCanvasHandler);
    this.onFinish();
  };

  handleMessage = ({ data }: MessageEvent) => {
    const { id, renderer, checkEat, finish } = this;
    const message = JSON.parse(data) as IncomingMessage;
    switch (message.type) {
      case 'JOIN':
        this.users = [message.body.new_user];
        this.me = this.users.find((user) => user.id === id);
        break;
      case 'OBJECTS':
        this.users = message.body.users;
        this.me = this.users.find((user) => user.id === id);
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
    try {
      this.connection?.send(JSON.stringify(payload));
    } catch (error) {
      console.error(error);
      this.finish();
    }
  };

  bindKeys = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'q':
        this.finish();
    }
  };

  checkEat = () => {
    const { me, users, preys, sendMessage } = this;
    if (!me) return;
    const eatenPrey = preys.find(
      (prey) => distanceSquare(me.position, prey.position) < me.radius ** 2
    );
    if (eatenPrey) {
      sendMessage({ type: 'EAT', body: { prey_id: eatenPrey.id } });
      return;
    }
    const overlaidUser = users.find(
      (user) => user.id !== me.id && distanceSquare(me.position, user.position) < me.radius ** 2
    );
    if (overlaidUser && overlaidUser.radius < me.radius) {
      sendMessage({ type: 'MERGE', body: { colony_id: overlaidUser.id } });
      return;
    }
  };
}
