console.log("✅ script.js loaded!");

// Initialize Fabric.js canvas
const canvas = new fabric.Canvas("posterCanvas", {
  preserveObjectStacking: true
});

// Make a gradient rectangle background
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

  // Remove old background rect if exists
  const oldBg = canvas.getObjects("rect").find(r => !r.selectable);
  if (oldBg) canvas.remove(oldBg);

  canvas.add(rect);
  canvas.sendToBack(rect);
  canvas.renderAll();
}
setGradientBackground();

// Handle solid background color picker
document.getElementById("bgColorPicker").addEventListener("input", function (e) {
  console.log("🎨 Background changed:", e.target.value);
  const rect = canvas.getObjects("rect").find(r => !r.selectable);
  if (rect) {
    rect.set("fill", e.target.value);
    canvas.renderAll();
  }
});

// Handle photo upload
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
        canvas.sendToBack(img);
        console.log("📸 Photo added to canvas");
      });
    };
    reader.readAsDataURL(file);
  }
});

// Handle song input
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
  console.log("🎶 Song text updated");
});

// Handle sticker selection
document.querySelectorAll(".sticker-option").forEach(sticker => {
  sticker.addEventListener("click", function () {
    fabric.Image.fromURL(this.src, function (img) {
      img.scale(0.2);
      img.set({ left: 100, top: 100 });
      canvas.add(img);
      console.log("✨ Sticker added:", sticker.alt);
    });
  });
});

// Handle adding custom text
document.getElementById("addTextBtn").addEventListener("click", function () {
  const textValue = document.getElementById("customText").value;
  if (textValue.trim()) {
    const text = new fabric.Textbox(textValue, {
      left: 150,
      top: 300,
      fontSize: 24,
      fill: "yellow",
      fontFamily: "Arial",
      editable: true,
      width: 200
    });
    canvas.add(text);
    console.log("📝 Custom text added:", textValue);
    document.getElementById("customText").value = "";
  }
});

// Download poster
document.getElementById("downloadBtn").addEventListener("click", function () {
  const dataURL = canvas.toDataURL({ format: "png" });
  const link = document.createElement("a");
  link.download = "weekend_wrapped.png";
  link.href = dataURL;
  link.click();
  console.log("💾 Poster downloaded");
});
