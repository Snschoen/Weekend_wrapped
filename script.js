// Initialize Fabric.js canvas
const canvas = new fabric.Canvas("posterCanvas", {
  backgroundColor: "#222"
});

// Handle photo upload
document.getElementById("photoUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      fabric.Image.fromURL(event.target.result, function(img) {
        img.scaleToWidth(500);
        img.scaleToHeight(350);
        img.set({ top: 0, left: 0 });
        canvas.add(img);
        canvas.sendToBack(img);
      });
    };
    reader.readAsDataURL(file);
  }
});

// Handle song input
document.getElementById("songInput").addEventListener("input", function(e) {
  const existingSongText = canvas.getObjects("text").find(obj => obj.songText);
  if (existingSongText) {
    existingSongText.text = e.target.value || "🎵 Your Song Here";
    canvas.renderAll();
  } else {
    const text = new fabric.Text(e.target.value || "🎵 Your Song Here", {
      left: 20,
      top: 360,
      fontSize: 20,
      fill: "white",
      fontFamily: "Arial",
      songText: true
    });
    canvas.add(text);
  }
});

// Handle sticker selection
document.querySelectorAll(".sticker-option").forEach(sticker => {
  sticker.addEventListener("click", function() {
    fabric.Image.fromURL(this.src, function(img) {
      img.scale(0.2);
      img.set({ left: 100, top: 100 });
      canvas.add(img);
    });
  });
});

// Handle adding custom text
document.getElementById("addTextBtn").addEventListener("click", function() {
  const textValue = document.getElementById("customText").value;
  if (textValue.trim()) {
    const text = new fabric.Textbox(textValue, {
      left: 150,
      top: 200,
      fontSize: 24,
      fill: "yellow",
      fontFamily: "Arial",
      editable: true
    });
    canvas.add(text);
    document.getElementById("customText").value = "";
  }
});

// Download poster
document.getElementById("downloadBtn").addEventListener("click", function() {
  const dataURL = canvas.toDataURL({ format: "png" });
  const link = document.createElement("a");
  link.download = "weekend_wrapped.png";
  link.href = dataURL;
  link.click();
});
