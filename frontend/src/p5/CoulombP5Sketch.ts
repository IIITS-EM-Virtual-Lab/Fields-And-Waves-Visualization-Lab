// src/p5/CoulombP5Sketch.ts
import p5Types from "p5";

export const CoulombP5Sketch = (p: p5Types) => {
  let charges: { x: number; y: number; q: number }[] = [];
  let dragging: number | null = null;
  let draggingNew: { x: number; y: number; q: number } | null = null;
  let plusImg: p5Types.Image, minusImg: p5Types.Image;
  const trayBox = { x: 300, y: 420, w: 200, h: 60 };

  p.preload = () => {
    plusImg = p.loadImage("https://cdn.pixabay.com/photo/2017/01/10/23/01/icon-1970474_640.png");
    minusImg = p.loadImage("https://cdn-icons-png.flaticon.com/512/9068/9068779.png");
  };

  p.setup = () => {
    p.createCanvas(800, 500);
    p.imageMode(p.CENTER);
    p.textFont("Arial", 14);
  };

  p.draw = () => {
    p.background(0);
    drawElectricField();
    drawCharges();
    drawTrayBox();
    drawDraggingPreview();
  };

  function drawElectricField() {
    for (let x = 40; x < p.width; x += 40) {
      for (let y = 40; y < p.height - 80; y += 40) {
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

    p.image(plusImg, trayBox.x + 50, trayBox.y + 30, 32, 32);
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER);
    p.text("+1 nc", trayBox.x + 50, trayBox.y + 52);

    p.image(minusImg, trayBox.x + 150, trayBox.y + 30, 32, 32);
    p.text("-1 nc", trayBox.x + 150, trayBox.y + 52);
  }

  function drawDraggingPreview() {
    if (draggingNew) {
      const img = draggingNew.q > 0 ? plusImg : minusImg;
      p.image(img, p.mouseX, p.mouseY, 32, 32);
    }
  }

  p.mousePressed = () => {
    const { mouseX, mouseY } = p;
    if (mouseX > trayBox.x + 30 && mouseX < trayBox.x + 70 && mouseY > trayBox.y + 10 && mouseY < trayBox.y + 50) {
      draggingNew = { x: mouseX, y: mouseY, q: 1 };
      return;
    }

    if (mouseX > trayBox.x + 130 && mouseX < trayBox.x + 170 && mouseY > trayBox.y + 10 && mouseY < trayBox.y + 50) {
      draggingNew = { x: mouseX, y: mouseY, q: -1 };
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
};
