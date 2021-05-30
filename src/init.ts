function resolveCanvasContext() {
  const canvas = document.getElementById('main') as HTMLCanvasElement;
  const context = canvas.getContext('webgl');
  if (context == null) throw new Error('webgl_not_compatible');
  window._mainContext = context;
}

export function init() {
  resolveCanvasContext();
}
