export default class Ticket {
  constructor(container, server) {
    this.container = document.querySelector(container);
    this.newTicketBtn = this.container.querySelector('.new-ticket');

    this.server = server;
    this.cache = null;



    this.onClickBtnNewTicket = this.onClickBtnNewTicket.bind(this);
    this.onClickBtnConfirmNewTicket = this.onClickBtnConfirmNewTicket.bind(this);

    this.onClickConfirmTask = this.onClickConfirmTask.bind(this);
    this.onClickBtnDeleteTicket = this.onClickBtnDeleteTicket.bind(this);
    
    this.onClickIconEditTicket = this.onClickIconEditTicket.bind(this);
    this.onSubmitEditTicket = this.onSubmitEditTicket.bind(this);

    this.onClickBtnConfirmDeleteTicket = this.onClickBtnConfirmDeleteTicket.bind(this);
    this.onClickBtnCancelDeleteTicket = this.onClickBtnCancelDeleteTicket.bind(this);

    this.onClickNameTicket = this.onClickNameTicket.bind(this);
  }

  start() {
    this.init();

    this.newTicketBtn.addEventListener('click', this.onClickBtnNewTicket);
  }

  async init() {
    const table = this.container.querySelector('.tickets-list');

    const response = await fetch(`${this.server}?method=allTickets`);
    const body = await response.json();

    if (body.tickets.length === 0) {
      return;
    }

    body.tickets.forEach((ticket) => {
      this.showTicket(ticket, table);
    });

    // const xhr = new XMLHttpRequest();

    // const parametrs = '?method=allTickets';
    // xhr.open('GET', this.server + parametrs);

    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState !== 4) return;

    //   const response = JSON.parse(xhr.responseText);

    //   response.tickets.forEach((ticket) => {
    //     this.showTicket(ticket, table);
    //   });
    // }.bind(this);

    // xhr.send();
  }


  showTicket(ticket, parentElem) {
    const status = ticket.status ? 'class="done-confirm confirm-background"' : 'class="done-confirm"';

    parentElem.insertAdjacentHTML('beforeend', `
      <tr class="list-item" data-id="${ticket.id}">
        <td class="item-done">
          <input type="button" ${status}>
        </td>
        <td class="item-title">
            ${ticket.name}
        </td>
        <td class="item-date">
            ${ticket.created}
        </td>
        <td class="item-setting">
          <input type="button" class="setting-edit">
          <input type="button" class="setting-delete">
        </td>
      </tr>
    `);

    const tr = parentElem.lastChild;
    const confirmBtn = tr.querySelector('.done-confirm');
    const deleteBtn = tr.querySelector('.setting-delete');
    const editBtn = tr.querySelector('.setting-edit');
    const itemTitle = tr.querySelector('.item-title');

    confirmBtn.addEventListener('click', this.onClickConfirmTask);
    editBtn.addEventListener('click', this.onClickIconEditTicket);
    deleteBtn.addEventListener('click', this.onClickBtnDeleteTicket);
    itemTitle.addEventListener('click', this.onClickNameTicket);
  }

  createModalWindow(parent) {
    parent.insertAdjacentHTML('beforeend', `
      <form name="new-form" class="modal delete-ticket">
        <h1 class="modal-title">Добавить тикет</h1>

        <label for="short-description">Краткое описание</label>
        <input name="short-description" id="short-description" class="short-description" type="text" required>

        <label for="description">Подробное описание</label>
        <textarea name="description" id="description" class="description" required></textarea>

        <input name="btn-cancel" type="button" class="modal-btn btn-cancel" value="Отмена">
        <input type="submit" class="modal-btn btn-confirm" value="Ок">
        </form>
    `);

    const form = document.forms['new-form'];
    const cancelBtn = form.elements['btn-cancel'];

    cancelBtn.addEventListener('click', this.onClickBtnCancelDeleteTicket);
    form.addEventListener('submit', this.onClickBtnConfirmNewTicket);
  }

  onClickBtnNewTicket(e) {
    this.createModalWindow(this.container);
  }

  async onClickBtnConfirmNewTicket(e) {
    e.preventDefault();

    const form = document.forms['new-form'];
    const formData = new FormData(form);

    const name = formData.get('short-description');
    const description = formData.get('description');

    const response = await fetch(`${this.server}?method=addTicket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        name,
        description,
      }),
    });

    const body = await response.json();

    const table = this.container.querySelector('.tickets-list');

    this.showTicket(body.ticket, table);
    form.remove();
  }












  onClickConfirmTask(e) {
    const { target } = e;
    const td = target.parentNode;
    const tr = td.parentNode;

    const state = !!target.classList.contains('confirm-background');

    const parametrs = `?method=ticketConfirm&id=${tr.dataset.id}&state=${state}`;
    const xhr = new XMLHttpRequest();

    xhr.open('PATCH', this.server + parametrs);

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      const response = JSON.parse(xhr.responseText);

      if (response.status === 'Ok') {
        target.classList.toggle('confirm-background');
      }
    };

    xhr.send();
  }

  // Модальное окно редактирования тикета
  async showModalWindowEditTicket(parent, target) {
    try {
      const tr = target.closest('tr');
      const { id } = tr.dataset;

      const response = await fetch(`${this.server}?method=ticketById&id=${id}`, {
        method: 'GET',
      });
      const body = await response.json();

      this.cache = {
        id,
        name: body.tickets.name,
        description: body.tickets.description,
      };

      parent.insertAdjacentHTML('beforeend', `
        <form name="edit-form" class="ticket__modal" data-id="${id}">
            <h1 class="modal-title">Добавить тикет</h1>

            <label for="short-description">Краткое описание</label>
            <input name="short-description" id="short-description" class="short-description" type="text"
            value="${body.tickets.name}">

            <label for="description">Подробное описание</label>
            <textarea name="description" id="description" class="description">${body.tickets.description}</textarea>

            <input name="btn-cancel" type="button" class="modal-btn btn-cancel" value="Отмена">
            <input type="submit" class="modal-btn btn-confirm" value="Ок">

        </form>
      `);
      // parent.insertAdjacentHTML('beforeend', '<div class="global"></div>');

      const form = document.forms['edit-form'];
      const cancelBtn = form.elements['btn-cancel'];

      cancelBtn.addEventListener('click', this.onClickBtnCancelDeleteTicket);
      form.addEventListener('submit', this.onSubmitEditTicket);
    } catch (e) {
      return e.message;
    }
  }

  onClickIconEditTicket(e) {
    return this.showModalWindowEditTicket(this.container, e.target);
  }

  async onSubmitEditTicket(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const { id } = e.target.dataset;
    const name = formData.get('short-description');
    const description = formData.get('description');

    if (this.cache.name === name && this.cache.description === description) {
      e.target.remove();
      this.cache = null;

      return;
    }

    try {
      const response = await fetch(`${this.server}?method=editTicket&id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          id,
          name,
          description,
        }),
      });
      const body = await response.json();
      console.log(body);

      if (body.status === 'Ok') {
        const { name: newName, description: newDescription } = body.tickets[0];
        const trAll = this.container.querySelectorAll('tr');
        const tr = [...trAll].find((elm) => elm.dataset.id === id);
        const td = tr.querySelector('.item-title');

        td.textContent = newName;

        const tdText = td.querySelector('.item-text');
        if (tdText) {
          tdText.textContent = newDescription;
        }

        this.cache = null;
        e.target.remove();
        return;
      }
    } catch (e) {
      return e.message;
    }
  }




/*
__________________________________________________________
__________________________________________________________
__________________________________________________________
Отображение полного описания тикета
*/

  async onClickNameTicket(e) {
    const { target } = e;
    const tr = target.closest('tr');
    const itemText = tr.querySelector('.item-text');

    if (itemText) {
      itemText.remove();
      return;
    }

    const { id } = tr.dataset;

    const response = await fetch(`${this.server}?method=ticketById&id=${id}`, {
      method: 'GET',
    });
    const body = await response.json();

    if (body.status === 'Ok') {
      target.insertAdjacentHTML('beforeend', `
        <p class="item-text">${body.tickets.description}</p>
      `);
    }
  }








/*
__________________________________________________________
__________________________________________________________
__________________________________________________________

*/

  // Модальное окно удаления тикета
  onClickBtnDeleteTicket(e) {
    return this.showModalWindowDeleteTicket(this.container, e.target);
  }

  onClickBtnConfirmDeleteTicket(e) {
    e.preventDefault();

    const { id } = e.target.dataset;

    const xhr = new XMLHttpRequest();
    const parametrs = `?method=deleteTicket&id=${id}`;
    xhr.open('DELETE', this.server + parametrs);

    xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      const res = xhr.response;

      if (res.status.code === 200) {
        const tr = this.container.querySelectorAll('tr');

        tr.forEach((row) => {
          if (row.dataset.id === id) {
            row.remove();
          }
        });
      }
    }.bind(this);

    xhr.send();

    return document.forms['delete-form'].remove();
  }

  onClickBtnCancelDeleteTicket(e) {
    this.cache = null;
    const form = e.target.closest('form');
    return form.remove();
  }

  showModalWindowDeleteTicket(parent, target) {
    const tr = target.closest('tr');
    const { id } = tr.dataset;

    parent.insertAdjacentHTML('beforeend', `
      <form name="delete-form" class="modal delete-ticket">
        <h1 class="modal-title">Добавить тикет</h1>

        <p class="modal-text">
          Вы уверены, что хотите удалить тикет? Это действие необратимо.
        </p>

        <input name="btn-cancel" type="button" class="modal-btn btn-cancel" value="Отмена">
        <input name="btn-confirm" type="button" class="modal-btn btn-confirm" value="Ок" data-id="${id}">
      </form>
    `);

    const form = document.forms['delete-form'];
    const cancelBtn = form.elements['btn-cancel'];
    const confirmBtn = form.elements['btn-confirm'];

    cancelBtn.addEventListener('click', this.onClickBtnCancelDeleteTicket);
    confirmBtn.addEventListener('click', this.onClickBtnConfirmDeleteTicket);
  }
}
