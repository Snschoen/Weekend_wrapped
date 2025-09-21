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

// ===== Photo Upload =====
document.getElementById("photoUpload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      fabric.Image.fromURL(event.target.result, function (img) {
        img.scaleToWidth(canvas.width);
        img.scaleToHeight(canvas.height * 0.6);
        img.set({ left: 0, top: 0, selectable: true });
        canvas.add(img);
        canvas.renderAll();
        console.log("📸 Photo added");
      });
    };
    reader.readAsDataURL(file);
  }
});

// ===== Song Input =====
document.getElementById("songInput").addEventListener("input", function (e) {
  let existingSongText = canvas.getObjects("text").find(obj => obj.songText);
  if (existingSongText) {
    existingSongText.text = e.target.value || "🎵 Your Song Here";
    canvas.renderAll();
  } else {
    const text = new fabric.Text(e.target.value || "🎵 Your Song Here", {
      left: 20,
      top: canvas.height - 120,
      fontSize: 20,
      fill: "white",
      fontFamily: "Arial",
      songText: true
    });
    canvas.add(text);
  }
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

// ===== Custom Text =====
document.getElementById("addTextBtn").addEventListener("click", function () {
  const textValue = document.getElementById("customText").value;
  if (textValue.trim()) {
    const text = new fabric.Textbox(textValue, {
      left: 150,
      top: 300,
      fontSize: 24,
      fill: "yellow",
      fontFamily: "Arial",
      width: 200
    });
    canvas.add(text);
    canvas.renderAll();
    console.log("📝 Custom text added:", textValue);
    document.getElementById("customText").value = "";
  }
});

// ===== Download Poster =====
document.getElementById("downloadBtn").addEventListener("click", function () {
  const dataURL = canvas.toDataURL({ format: "png" });
  const link = document.createElement("a");
  link.download = "weekend_wrapped.png";
  link.href = dataURL;
  link.click();
  console.log("💾 Poster downloaded");
});
