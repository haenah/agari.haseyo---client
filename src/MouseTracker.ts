import $ from 'jquery';

enum MouseTrackerState {
  ON,
  OFF,
}
class _MouseTracker {
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
  updatePosition = (e: MouseEvent) => {
    this.position = [e.offsetX, e.offsetY];
  };
}

const MouseTracker = new _MouseTracker();
export default MouseTracker;
