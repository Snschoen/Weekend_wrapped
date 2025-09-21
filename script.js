console.log("✅ script.js loaded!");

const canvas = new fabric.Canvas("posterCanvas");

// Initial two-zone layout: top for photo, bottom for text
canvas.setBackgroundColor("#191414", canvas.renderAll.bind(canvas));

// Draw bottom section (solid color area for text)
function drawBottomSection(color = "#191414") {
  const rect = new fabric.Rect({
    left: 0,
    top: 400,
    width: canvas.width,
    height: 200,
    fill: color,
    selectable: false,
    evented: false
  });

  // remove old rect if any
  const oldRect = canvas.getObjects("rect").find(r => r.sectionRect);
  if (oldRect) canvas.remove(oldRect);

  rect.sectionRect = true;
  canvas.add(rect);
  canvas.sendToBack(rect);
}
drawBottomSection();

// Background color picker changes bottom section color
document.getElementById("bgColorPicker").addEventListener("input", function(e) {
  drawBottomSection(e.target.value);
  canvas.renderAll();
});

// Handle photo upload (top section)
fabric.Image.fromURL(event.target.result, function(img) {
  img.scaleToWidth(canvas.width);
  img.scaleToHeight(400);
  img.set({ left: 0, top: 0, selectable: false, evented: false });

  canvas.add(img);
  canvas.sendToBack(img);
});

// Song input
document.getElementById("songInput").addEventListener("input", function(e) {
  let songText = canvas.getObjects("text").find(obj => obj.songText);
  if (!songText) {
    songText = new fabric.Text("🎵 " + e.target.value, {
      left: 20,
      top: 420,
      fontSize: 24,
      fill: "white",
      songText: true
    });
    canvas.add(songText);
  } else {
    songText.text = "🎵 " + (e.target.value || "Your Song Here");
  }
  canvas.renderAll();
});

// Stickers
document.querySelectorAll(".sticker-option").forEach(sticker => {
  sticker.addEventListener("click", function() {
    fabric.Image.fromURL(this.src, function(img) {
      img.scale(0.2);
      img.set({ left: 250, top: 250 });
      canvas.add(img);
    });
  });
});

// Custom text
document.getElementById("addTextBtn").addEventListener("click", function() {
  const val = document.getElementById("customText").value;
  if (val.trim()) {
    const text = new fabric.Textbox(val, {
      left: 20,
      top: 460,
      fontSize: 20,
      fill: "yellow",
      width: 460
    });
    canvas.add(text);
    document.getElementById("customText").value = "";
  }
});

// Download
document.getElementById("downloadBtn").addEventListener("click", function() {
  const dataURL = canvas.toDataURL({ format: "png" });
  const link = document.createElement("a");
  link.download = "weekend_wrapped.png";
  link.href = dataURL;
  link.click();
});
