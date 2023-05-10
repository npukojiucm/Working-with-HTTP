export default class ImgLoader {
  constructor(container) {
    this.container = document.querySelector(container);
    this.formData = new FormData();

    this.btnGetImg = this.container.querySelector('.get-img');
    this.btnBack = this.container.querySelector('.back');
    this.btnUploadImg = this.container.querySelector('.upload-img');

    this.fileContainer = this.container.querySelector('.file-container');
    this.input = this.container.querySelector('input');


    this.serverImgList = this.container.querySelector('.server-img__list');



    this.previewContainer = this.container.querySelector('.preview-loads');


    this.onDragOverFileContainer = this.onDragOverFileContainer.bind(this);
    this.onDropFileContainer = this.onDropFileContainer.bind(this);
    this.onChancheInput = this.onChancheInput.bind(this);

    this.onClickBtnGetImg = this.onClickBtnGetImg.bind(this);
    this.onClickBtnUploadFiles = this.onClickBtnUploadFiles.bind(this);
    this.onClickBtnBack = this.onClickBtnBack.bind(this);

    this.onClickBtnRemoveLoadItem = this.onClickBtnRemoveLoadItem.bind(this);

    this.onClickBtnConfirmDeleteFile = this.onClickBtnConfirmDeleteFile.bind(this);
  }


  start() {
    this.btnGetImg.addEventListener('click', this.onClickBtnGetImg);
    this.btnUploadImg.addEventListener('click', this.onClickBtnUploadFiles);
    this.btnBack.addEventListener('click', this.onClickBtnBack)

    this.fileContainer.addEventListener('drop', this.onDropFileContainer);
    this.fileContainer.addEventListener('dragover', this.onDragOverFileContainer);
    this.input.addEventListener('change', this.onChancheInput);
  }

  addPreviewImg(file, previewContainer) {
    const { name: fileName, size: fileSize, type: fileType } = file;

    const element = this.formData.has(fileName);
  
    if (element) {
      if (element.name === fileName && element.type === !fileType) {
        this.formData.append(fileName, file, fileName);
      }
      if (element.name === fileName && element.type === fileType && element.size !== fileSize) {
        this.formData.append(fileName, file, fileName);
      }
    } else {
      this.formData.append(fileName, file, fileName);
    }
  
    this.btnUploadImg.classList.add('visible');
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    reader.onload = () => {
      previewContainer.insertAdjacentHTML('beforeend', `
        <div class="load-item" data-name="${fileName}">
          <img src="${reader.result}" class="item-img">
          <div class="load-item__close"></div>
        </div>
      `);
  
      const child = previewContainer.children;
      const btnClose = child[child.length - 1].querySelector('.load-item__close');
  
      btnClose.addEventListener('click', this.onClickBtnRemoveLoadItem);
    };
  }

  createModalDeleteFile(container) {
    return `
      <div class="modal delete-file">
        <p>
          Это действие приведет к безвозвратному удалению файла ${container.dataset.name} с сервера. Вы точно хотите удалить файл?
        </p>
        
        <button id="cancel-delete" name="cancel" type="button">Отмена</button>
        <button id="confirm-delete" name="confirm" type="button" data-name="${container.dataset.name}">Ок</button>
      </div>
      `;
  }

  

  

  async onClickBtnGetImg(e) {
    this.btnBack.classList.remove('non-visible');
    e.target.classList.add('non-visible');
    this.fileContainer.classList.add('non-visible');

    const response = await fetch('http://localhost:3000/api/getImg', {
      method: 'GET',
    });
    const body = await response.json();

    if (response.status === 200) {
      body.files.forEach((file) => {
        this.serverImgList.insertAdjacentHTML('beforeend', `
        <div class="load-item" data-name="${file.name}">
          <a href="${file.src}">
            <img src="${file.src}" class="item-img">
          </a>
          <div class="load-item__close"></div>
        </div>
      `);
      });

      const btnsClose = this.serverImgList.querySelectorAll('.load-item__close');

      btnsClose.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const loadItem = e.target.closest('.load-item');

          this.serverImgList.insertAdjacentHTML('beforeend', this.createModalDeleteFile(loadItem));

          const cancelBtn = document.getElementById('cancel-delete');
          const confirmBtn = document.getElementById('confirm-delete');

          cancelBtn.addEventListener('click', (e) => {
            const modal = document.querySelector('.delete-file');
            return modal.remove();
          });

          confirmBtn.addEventListener('click', this.onClickBtnConfirmDeleteFile);
        });
      });
    }
  }

  onClickBtnBack(e) {
    e.target.classList.add('non-visible');

    const items = this.serverImgList.querySelectorAll('.load-item');
    items.forEach(item => {
      item.remove();
    });

    this.fileContainer.classList.remove('non-visible');
    this.btnGetImg.classList.remove('non-visible');
  }

  async onClickBtnUploadFiles(e) {
    const response = await fetch('http://localhost:3000/api/uploadFiles', {
      method: 'POST',
      body: this.formData,
    });

    if (response.status === 204) {
      const loadItems = this.previewContainer.querySelectorAll('.load-item');

      return loadItems.forEach(item => {
        item.remove();
      })
    }
  }  
  
  


  onDragOverFileContainer(e) {
    e.preventDefault();
  }

  onDropFileContainer(e) {
    e.preventDefault();

    const { files } = e.dataTransfer;
    const len = files.length;

    for (let i = 0; i < len; i += 1) {
      this.addPreviewImg(files[i], this.previewContainer);
    }
  }

  onChancheInput(e) {
    const { files } = e.target;
    const len = files.length;

    for (let i = 0; i < len; i += 1) {
      this.addPreviewImg(files[i], this.previewContainer);
    }
  }

  onClickBtnRemoveLoadItem(e) {
    const itemLoad = e.target.closest('.load-item');
    const { name: fileName } = itemLoad.dataset;

    this.formData.delete(fileName);

    if (Array.from(this.formData.keys()).length === 0) {
      this.btnUploadImg.classList.remove('show-submit');
    }

    return itemLoad.remove();
  }

  async onClickBtnConfirmDeleteFile(e) {
    const { name: fileName } = e.target.dataset;

    const response = await fetch('http://localhost:3000/api/deleteFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        file: fileName,
      }),
    });

    if (response.status === 204) {
      const items = this.serverImgList.querySelectorAll('.load-item');

      const item = [...items].find((item) => item.dataset.name === fileName);

      item.remove();

      const modal = this.serverImgList.querySelector('.delete-file');

      return modal.remove();
    }
  }
}
