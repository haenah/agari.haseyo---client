import $ from 'jquery';
import { Position } from './types/common.types';

enum MouseTrackerState {
  ON,
  OFF,
}
class _MouseTracker {
  private state: MouseTrackerState = MouseTrackerState.OFF;
  /** x, y */
  position: Position = { x: 0, y: 0 };
  start() {
    this.state === MouseTrackerState.OFF &&
      $('#game').get(0).addEventListener('mousemove', this.updatePosition);
    this.state = MouseTrackerState.ON;
  }
  stop() {
    this.state === MouseTrackerState.ON &&
      $('#game').get(0).removeEventListener('mousemove', this.updatePosition);
    this.state = MouseTrackerState.OFF;
  }
  updatePosition = ({ offsetX, offsetY }: MouseEvent) => {
    this.position = { x: offsetX, y: offsetY };
  };
}

const MouseTracker = new _MouseTracker();
export default MouseTracker;
