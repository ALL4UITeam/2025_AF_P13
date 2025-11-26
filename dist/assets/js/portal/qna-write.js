import "../modulepreload-polyfill.js";
import "../portal.js";
/* empty css      */
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.querySelector("[data-secret-password]");
  const secretRadios = document.querySelectorAll('input[name="radio-secret"]');
  const publicRadio = document.getElementById("radio-secret-2");
  const fileInput = document.getElementById("file-input");
  const fileNameText = document.querySelector("[data-file-name]");
  const fileListContainer = document.querySelector("[data-file-list]");
  let selectedFiles = [];
  if (passwordInput && secretRadios.length && publicRadio) {
    const syncPasswordState = () => {
      const isPublic = publicRadio.checked;
      passwordInput.readOnly = !isPublic;
      if (passwordInput.readOnly) {
        passwordInput.value = "";
      }
    };
    secretRadios.forEach((radio) => {
      radio.addEventListener("change", syncPasswordState);
    });
    syncPasswordState();
  }
  if (fileInput && fileNameText && fileListContainer) {
    const formatSize = (bytes) => {
      if (!bytes) return "0 B";
      const units = ["B", "KB", "MB", "GB"];
      const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
      const size = bytes / 1024 ** power;
      return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[power]}`;
    };
    const refreshInputFiles = () => {
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach((file) => dataTransfer.items.add(file));
      fileInput.files = dataTransfer.files;
    };
    const renderFileList = () => {
      fileListContainer.innerHTML = "";
      if (!selectedFiles.length) {
        fileNameText.textContent = "선택된 파일이 없습니다.";
        return;
      }
      selectedFiles.forEach((file, index) => {
        const item = document.createElement("li");
        item.className = "file-item";
        item.innerHTML = `
              <span class="file-item__name">${file.name}</span>
              <span class="file-item__size">${formatSize(file.size)}</span>
              <button type="button" class="file-item__remove" data-remove-index="${index}" aria-label="파일 삭제">
                &times;
              </button>
            `;
        fileListContainer.appendChild(item);
      });
      fileNameText.textContent = `${selectedFiles.length}개 파일 선택됨`;
    };
    fileInput.addEventListener("change", () => {
      if (!fileInput.files || !fileInput.files.length) return;
      selectedFiles = selectedFiles.concat(Array.from(fileInput.files));
      refreshInputFiles();
      renderFileList();
    });
    fileListContainer.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-index]");
      if (!removeButton) return;
      const index = Number(removeButton.getAttribute("data-remove-index"));
      if (Number.isNaN(index)) return;
      selectedFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
      refreshInputFiles();
      renderFileList();
    });
    renderFileList();
  }
});
