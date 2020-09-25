const Diagramax = require('diagramax');
const { Canvas, Circle, Rectangle } = Diagramax;

const circleA = new Circle({
  id: "circleA",
  text: "Circle A",
  x: 49,
  y: 180,
  width: 60,
  height: 60,
});
const canvas = new Canvas({
  width: 1440,
  height: 900,
  // We can add shapes at Canvas' instantiating time in two manners: 
  // providing a Shape instance or by providing a Shape object descriptor.
  shapes: [
    circleA,
    {
      id: "rectB",
      type: "rectangle",
      text: "Rect B",
      data: {},
      x: 201.5,
      y: 180,
      width: 111,
      height: 80,
    }
  ],
  // We can create connection between Shapes by providing a Shape 
  // instance or a Shape id. Both of them should exist in Canvas.
  connections: [
    {
      orig: circleA,
      dest: 'rectB',
    }
  ],
  onChange: (...args) => {
    undoButton.disabled = false;
    redoButton.disabled = true;
  }
});

const rectC = new Rectangle({
  id: "rectC",
  type: "rectangle",
  text: "Rect C",
  data: {},
  x: 386,
  y: 180,
  width: 114,
  height: 80
});

// Also we can Add shapes after instantiating the Canvas.
canvas.addShape(rectC);
canvas.addShape({
  id: "circleD",
  type: "circle",
  text: "Circle D",
  data: {},
  x: 545,
  y: 180,
  width: 60,
  height: 60
});

// Connecting shapes is also possible after Canvas instantiation.
canvas.connect(rectC, 'circleD');
canvas.connect('rectB', rectC);

let undoButton;
let redoButton;
const undo = () => {
  undoButton.disabled = canvas.undo() === 0;
  redoButton.disabled = false;
};

const redo = () => {
  redoButton.disabled = canvas.redo() === 0;
  undoButton.disabled = false;
}

document.addEventListener('DOMContentLoaded', function () {
  undoButton = document.querySelector('#undo');
  redoButton = document.querySelector('#redo');
  let counter = 1;

  document.querySelector('#diagram').appendChild(canvas.getElement());
  undoButton.addEventListener('click', undo, false);
  redoButton.addEventListener('click', redo, false);

  document.querySelector('#add').addEventListener('click', () => {
    const selection = document.querySelector('#shape-selector').value;
    const position = { x: 50, y: 50 };
    let shape;

    switch (selection) {
      case 'Circle':
        shape = new Circle({
          text: `Circle #${counter}`,
          position,
        });
        break;
      case 'Rectangle':
        shape = new Rectangle({
          text: `Rectangle #${counter}`,
          position,
        });
        break;
      case 'Triangle':
        shape = new Triangle({
          text: `Triangle #${counter}`,
          position,
        });
        break;
      case 'Ellipse':
        shape = new Ellipse({
          text: `Ellipse #${counter}`,
          position,
        });
        break;
      default:
    }

    if (shape) {
      canvas.executeCommand(COMMANDS.SHAPE_ADD, canvas, shape);
      counter += 1;
    }
  }, false);

  document.querySelector('#data').addEventListener('click', () => {
    console.log(canvas.toJSON());
  }, false);

  // Here we add the undo/redo key binding.
  window.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyZ':
        if (event.ctrlKey) {
          if (event.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
        break;
    }
  }, false);
});