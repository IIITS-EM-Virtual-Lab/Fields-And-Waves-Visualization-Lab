import p5Types from "p5";

export const CoulombP5Sketch = (p: p5Types) => {
  let charges: { x: number; y: number; q: number }[] = [];
  let dragging: number | null = null;
  let draggingNew: { x: number; y: number; q: number } | null = null;
  let plusImg: p5Types.Image, minusImg: p5Types.Image;
  const trayBox = { x: 380, y: 500, w: 280, h: 90 };

  let showField = false;
  let inputPlus: p5Types.Element, inputMinus: p5Types.Element;
  let canvasElement: HTMLCanvasElement;

  p.preload = () => {
    plusImg = p.loadImage("https://cdn.pixabay.com/photo/2017/01/10/23/01/icon-1970474_640.png");
    minusImg = p.loadImage("https://cdn-icons-png.flaticon.com/512/9068/9068779.png");
  };

  p.setup = () => {
    const canvas = p.createCanvas(1000, 600);
    canvasElement = canvas.elt as HTMLCanvasElement;

    p.imageMode(p.CENTER);
    p.textFont("Arial", 14);

    inputPlus = p.createInput("1");
    inputPlus.position(-1000, -1000);
    inputPlus.size(35, 20);

    inputMinus = p.createInput("1");
    inputMinus.position(-1000, -1000);
    inputMinus.size(35, 20);
  };

  p.draw = () => {
    p.background(0);
    if (showField) drawElectricField();
    drawCharges();
    drawTrayBox();
    drawDraggingPreview();
  };

  function drawElectricField() {
    for (let x = 40; x < p.width; x += 40) {
      for (let y = 40; y < p.height - 100; y += 40) {
        let fx = 0, fy = 0;
        for (const ch of charges) {
          const dx = x - ch.x;
          const dy = y - ch.y;
          const rSq = dx * dx + dy * dy;
          const r = Math.sqrt(rSq) + 1;
          const f = ch.q / rSq;
          fx += f * dx / r;
          fy += f * dy / r;
        }
        const angle = p.atan2(fy, fx);
        p.push();
        p.translate(x, y);
        p.rotate(angle);
        p.stroke(255);
        p.strokeWeight(2);
        p.line(-8, 0, 8, 0);
        p.fill(255);
        p.noStroke();
        p.triangle(8, 0, 4, -4, 4, 4);
        p.pop();
      }
    }
  }

  function drawCharges() {
    for (const ch of charges) {
      const img = ch.q > 0 ? plusImg : minusImg;
      p.image(img, ch.x, ch.y, 32, 32);
    }
  }

  function drawTrayBox() {
    p.noFill();
    p.stroke(255);
    p.strokeWeight(2);
    p.rect(trayBox.x, trayBox.y, trayBox.w, trayBox.h, 10);

    const plusX = trayBox.x + 60;
    const minusX = trayBox.x + 180;
    const iconY = trayBox.y + 30;

    // Icons
    p.image(plusImg, plusX, iconY, 22, 22);
    p.image(minusImg, minusX, iconY, 22, 22);

    // Labels and input below
    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);

    // + row
    p.text("+", plusX - 25, iconY + 38);
    inputPlus.position(canvasElement.offsetLeft + plusX - 15, canvasElement.offsetTop + iconY + 28);
    p.text("nc", plusX + 25, iconY + 38);

    // - row
    p.text("-", minusX - 25, iconY + 38);
    inputMinus.position(canvasElement.offsetLeft + minusX - 15, canvasElement.offsetTop + iconY + 28);
    p.text("nc", minusX + 25, iconY + 38);
  }

  function drawDraggingPreview() {
    if (draggingNew) {
      const img = draggingNew.q > 0 ? plusImg : minusImg;
      p.image(img, p.mouseX, p.mouseY, 32, 32);
    }
  }

  p.mousePressed = () => {
    const { mouseX, mouseY } = p;

    const plusX = trayBox.x + 60;
    const minusX = trayBox.x + 180;

    if (mouseX > plusX - 16 && mouseX < plusX + 16 && mouseY > trayBox.y + 10 && mouseY < trayBox.y + 50) {
      const mag = parseFloat((inputPlus as any).value());
      draggingNew = { x: mouseX, y: mouseY, q: mag };
      return;
    }

    if (mouseX > minusX - 16 && mouseX < minusX + 16 && mouseY > trayBox.y + 10 && mouseY < trayBox.y + 50) {
      const mag = parseFloat((inputMinus as any).value());
      draggingNew = { x: mouseX, y: mouseY, q: -mag };
      return;
    }

    for (let i = 0; i < charges.length; i++) {
      const ch = charges[i];
      if (p.dist(mouseX, mouseY, ch.x, ch.y) < 20) {
        dragging = i;
        break;
      }
    }
  };

  p.mouseDragged = () => {
    if (dragging !== null) {
      charges[dragging].x = p.mouseX;
      charges[dragging].y = p.mouseY;
    }
    if (draggingNew) {
      draggingNew.x = p.mouseX;
      draggingNew.y = p.mouseY;
    }
  };

  p.mouseReleased = () => {
    if (dragging !== null) {
      const ch = charges[dragging];
      if (ch.x > trayBox.x && ch.x < trayBox.x + trayBox.w && ch.y > trayBox.y && ch.y < trayBox.y + trayBox.h) {
        charges.splice(dragging, 1);
      }
      dragging = null;
    }

    if (draggingNew) {
      if (p.mouseX > trayBox.x && p.mouseX < trayBox.x + trayBox.w && p.mouseY > trayBox.y && p.mouseY < trayBox.y + trayBox.h) {
        draggingNew = null;
      } else {
        charges.push({ x: p.mouseX, y: p.mouseY, q: draggingNew.q });
        draggingNew = null;
      }
    }
  };

  p.keyPressed = () => {
    if (p.key === ' ') {
      showField = !showField;
    }
  };
};
