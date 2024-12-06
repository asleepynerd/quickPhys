export class ToolManager {
  constructor(simulation) {
    this.simulation = simulation;
    this.currentTool = 'sand';
    this.setupEventListeners();
  }

  setupEventListeners() {
    const toolbar = document.getElementById('toolbar');
    const buttons = toolbar.getElementsByClassName('tool-btn');

    Array.from(buttons).forEach(button => {
      button.addEventListener('click', () => {
        Array.from(buttons).forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.currentTool = button.dataset.type;
      });
    });
  }
}