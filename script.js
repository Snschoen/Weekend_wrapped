console.log("✅ script.js loaded!");

// Initialize Fabric.js canvas
const canvas = new fabric.Canvas("posterCanvas", {
  preserveObjectStacking: true
});

// ===== Background Management =====
function setGradientBackground() {
  const rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: canvas.width,
    height: canvas.height,
    selectable: false,
    evented: false
  });

  rect.set("fill", new fabric.Gradient({
    type: "linear",
    gradientUnits: "percentage",
    coords: { x1: 0, y1: 0, x2: 1, y2: 1 },
    colorStops: [
      { offset: 0, color: "#1db954" },
      { offset: 1, color: "#191414" }
    ]
  }));

  const oldBg = canvas.getObjects("rect").find(r => !r.selectable);
  if (oldBg) canvas.remove(oldBg);

  canvas.add(rect);
  canvas.sendToBack(rect);
  canvas.renderAll();
}

function setSolidBackground(color) {
  const rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: canvas.width,
    height: canvas.height,
    fill: color,
    selectable: false,
    evented: false
  });

  const oldBg = canvas.getObjects("rect").find(r => !r.selectable);
  if (oldBg) canvas.remove(oldBg);

  canvas.add(rect);
  canvas.sendToBack(rect);
  canvas.renderAll();
}

// Default = gradient
setGradientBackground();

// Toggle background mode
document.getElementById("gradientToggle").addEventListener("change", function(e) {
  if (e.target.checked) {
    console.log("🌈 Gradient background enabled");
    setGradientBackground();
  } else {
    console.log("🎨 Solid color mode enabled");
    const color = document.getElementById("bgColorPicker").value;
    setSolidBackground(color);
  }
});

// Handle color picker
document.getElementById("bgColorPicker").addEventListener("input", function(e) {
  if (!document.getElementById("gradientToggle").checked) {
    setSolidBackground(e.target.value);
  }
});


// Add editable labels
const songLabel = new fabric.Textbox("Song on Repeat:", {
  left: 20,
  top: 380,
  fontSize: 18,
  fill: "white",
  fontFamily: "Arial",
  width: 300,       // ensures text wraps if it's long
  editable: true
});

const funLabel = new fabric.Textbox("Something Fun:", {
  left: 20,
  top: 420,
  fontSize: 18,
  fill: "white",
  fontFamily: "Arial",
  width: 300,
  editable: true
});

const happenedLabel = new fabric.Textbox("What Happened:", {
  left: 20,
  top: 460,
  fontSize: 18,
  fill: "white",
  fontFamily: "Arial",
  width: 300,
  editable: true
});

// Add them to the canvas
canvas.add(songLabel, funLabel, happenedLabel);

// Handle main photo upload
document.getElementById("photoUpload").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          fabric.Image.fromURL(event.target.result, function(img) {
            img.scaleToWidth(canvas.width);
            img.scaleToHeight(canvas.height * 0.7); // top section
            img.set({ left: 0, top: 0, selectable: true });
            canvas.add(img);
            canvas.renderAll();
          });
        };
        reader.readAsDataURL(file);
    }
});

// Handle secondary photo upload
document.getElementById("photoUpload2").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          fabric.Image.fromURL(event.target.result, function(img) {
            img.scale(0.4);
            img.set({ left: 300, top: 400, selectable: true });
            canvas.add(img);
          });
        };
        reader.readAsDataURL(file);
    }
});

// Reset button
document.getElementById("resetBtn").addEventListener("click", function() {
    canvas.clear();
    setGradientBackground();
    canvas.add(songLabel, funLabel, happenedLabel);
    songLabel.text = "Song on Repeat:"; songLabel.value = null;
    funLabel.text = "Something Fun:"; funLabel.value = null;
    happenedLabel.text = "What Happened:"; happenedLabel.value = null;
    canvas.renderAll();
});

// Download poster
document.getElementById("downloadBtn").addEventListener("click", function() {
    const dataURL = canvas.toDataURL({ format: "png" });
    const link = document.createElement("a");
    link.download = "weekend_wrapped.png";
    link.href = dataURL;
    link.click();
});

// ===== Stickers =====
document.querySelectorAll(".sticker-option").forEach(sticker => {
  sticker.addEventListener("click", function () {
    fabric.Image.fromURL(this.src, function (img) {
      img.scale(0.2);
      img.set({ left: 100, top: 100 });
      canvas.add(img);
      canvas.renderAll();
      console.log("✨ Sticker added:", sticker.alt);
    });
  });
});
