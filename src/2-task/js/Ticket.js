/* eslint-disable class-methods-use-this */
export default class Ticket {
  constructor(container, server) {
    this.container = document.querySelector(container);
    this.newTicketBtn = this.container.querySelector('.btn-new-ticket');

    this.server = server;
    this.cache = null;

    this.onClickBtnNewTicket = this.onClickBtnNewTicket.bind(this);
    this.onClickBtnConfirmNewTicket = this.onClickBtnConfirmNewTicket.bind(this);

    this.onClickBtnStatusTicket = this.onClickBtnStatusTicket.bind(this);
    this.onClickBtnDeleteTicket = this.onClickBtnDeleteTicket.bind(this);

    this.onClickIconEditTicket = this.onClickIconEditTicket.bind(this);
    this.onSubmitEditTicket = this.onSubmitEditTicket.bind(this);

    this.onClickBtnConfirmDeleteTicket = this.onClickBtnConfirmDeleteTicket.bind(this);
    this.onClickBtnCancelNewOrEditTicket = this.onClickBtnCancelNewOrEditTicket.bind(this);

    this.onClickTitleTicket = this.onClickTitleTicket.bind(this);
    this.onClickBtnCancelDeleteTicket = this.onClickBtnCancelDeleteTicket.bind(this);
  }

  start() {
    this.init();

    this.newTicketBtn.addEventListener('click', this.onClickBtnNewTicket);
  }

  async init() {
    const table = this.container.querySelector('.tickets-list');

    const response = await fetch(`${this.server}allTickets`);

    if (response.status === 200) {
      const body = await response.json();

      if (body.tickets.length === 0) {
        return;
      }

      body.tickets.forEach((ticket) => {
        this.showTicket(ticket, table);
      });
    }
  }

  showTicket(ticket, parentElem) {
    const status = ticket.status ? 'class="btn-status status-background"' : 'class="btn-status"';

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
          <input type="button" class="btn-edit">
          <input type="button" class="btn-delete">
        </td>
      </tr>
    `);

    const tr = parentElem.lastChild;
    const btnStatus = tr.querySelector('.btn-status');
    const btnDelete = tr.querySelector('.btn-delete');
    const btnEdit = tr.querySelector('.btn-edit');
    const itemTitle = tr.querySelector('.item-title');

    btnStatus.addEventListener('click', this.onClickBtnStatusTicket);
    btnEdit.addEventListener('click', this.onClickIconEditTicket);
    btnDelete.addEventListener('click', this.onClickBtnDeleteTicket);
    itemTitle.addEventListener('click', this.onClickTitleTicket);
  }

  createFormNewOrEditTicket(parent, typeTicket, value) {
    let datasetId = '';
    let nameValue = '';
    let descriptionValue = '';
    let handler = this.onClickBtnConfirmNewTicket;

    if (typeTicket === 'edit-ticket') {
      datasetId = `data-id="${value.id}"`;
      nameValue = `value="${value.name}"`;
      descriptionValue = `${value.description}`;
      handler = this.onSubmitEditTicket;
    }

    parent.insertAdjacentHTML('beforeend', `
      <form name="${typeTicket}" class="modal form-${typeTicket}" ${datasetId}>
        <h1 class="form-title">Добавить тикет</h1>

        <label for="name">Краткое описание</label>
        <input name="name" id="name" class="name" type="text" required ${nameValue}>

        <label for="description">Подробное описание</label>
        <textarea name="description" id="description" class="description" required>${descriptionValue}</textarea>

        <input name="btn-cancel" type="button" class="modal-btn btn-cancel" value="Отмена">
        <input type="submit" class="modal-btn btn-confirm" value="Ок">
      </form>
    `);

    const form = document.forms[typeTicket];
    const btnCancel = form.elements['btn-cancel'];

    btnCancel.addEventListener('click', this.onClickBtnCancelNewOrEditTicket);
    form.addEventListener('submit', handler);
  }

  createModalDeleteTicket(parent, target) {
    const tr = target.closest('tr');
    const { id } = tr.dataset;

    parent.insertAdjacentHTML('beforeend', `
      <div class="modal modal-delete-ticket">
        <h1 class="modal-title">Удалить тикет</h1>

        <p class="modal-text">
          Вы уверены, что хотите удалить тикет? Это действие необратимо.
        </p>

        <input name="btn-cancel" type="button" class="modal-btn btn-cancel" value="Отмена">
        <input type="button" class="modal-btn btn-confirm" value="Ок" data-id="${id}">
      </div>
    `);

    const modal = parent.querySelector('.modal-delete-ticket');
    const btnCancel = modal.querySelector('.btn-cancel');
    const btnConfirm = modal.querySelector('.btn-confirm');

    btnCancel.addEventListener('click', this.onClickBtnCancelDeleteTicket);
    btnConfirm.addEventListener('click', this.onClickBtnConfirmDeleteTicket);
  }

  // New Ticket Btn
  onClickBtnNewTicket() {
    this.createFormNewOrEditTicket(this.container, 'new-ticket');
  }

  async onClickBtnConfirmNewTicket(e) {
    e.preventDefault();

    const form = document.forms['new-ticket'];
    const formData = new FormData(form);

    const response = await fetch(`${this.server}addTicket`, {
      method: 'POST',
      body: formData,
    });

    if (response.status === 200) {
      const body = await response.json();
      const table = this.container.querySelector('.tickets-list');

      this.showTicket(body.ticket, table);
      form.remove();
    }
  }

  onClickBtnCancelNewOrEditTicket(e) {
    this.cache = null;
    const form = e.target.closest('form');
    return form.remove();
  }

  // Click ico btn - status, delete, edit and click title ticket:
  //
  // *** Ticket ico-btn - status
  async onClickBtnStatusTicket(e) {
    const { target } = e;
    const tr = target.closest('tr');

    const status = !!target.classList.contains('status-background');

    const response = await fetch(`${this.server}statusTicket`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        id: tr.dataset.id,
        status,
      }),
    });

    if (response.status === 204) {
      target.classList.toggle('status-background');
    }
  }

  // *** Title ticket
  async onClickTitleTicket(e) {
    const { target } = e;
    const tr = target.closest('tr');
    const itemText = tr.querySelector('.item-text');

    if (itemText) {
      itemText.remove();
      return;
    }

    const { id } = tr.dataset;

    const response = await fetch(`${this.server}ticketById?id=${id}`, {
      method: 'GET',
    });
    const body = await response.json();

    if (response.status === 200) {
      target.insertAdjacentHTML('beforeend', `
        <p class="item-text">${body.ticket.description}</p>
      `);
    }
  }

  // *** Ticket ico-btn - delete
  onClickBtnDeleteTicket(e) {
    return this.createModalDeleteTicket(this.container, e.target);
  }

  onClickBtnCancelDeleteTicket(e) {
    const modal = e.target.closest('div');
    return modal.remove();
  }

  async onClickBtnConfirmDeleteTicket(e) {
    const modal = e.target.closest('div');
    const { id } = e.target.dataset;

    const response = await fetch(`${this.server}deleteTicket?id=${id}`, {
      method: 'DELETE',
    });

    if (response.status === 204) {
      const tr = this.container.querySelectorAll('tr');

      tr.forEach((row) => {
        if (row.dataset.id === id) {
          row.remove();
        }
      });
    }
    return modal.remove();
  }

  // *** Ticket ico-btn - edit
  async onClickIconEditTicket(e) {
    const tr = e.target.closest('tr');
    const { id } = tr.dataset;

    const response = await fetch(`${this.server}ticketById?id=${id}`, {
      method: 'GET',
    });

    if (response.status === 200) {
      const body = await response.json();

      this.cache = {
        id,
        name: body.ticket.name,
        description: body.ticket.description,
      };

      this.createFormNewOrEditTicket(this.container, 'edit-ticket', body.ticket);
    }
  }

  async onSubmitEditTicket(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const { id } = e.target.dataset;

    const name = formData.get('name');
    const description = formData.get('description');

    if (this.cache.name === name && this.cache.description === description) {
      e.target.remove();
      this.cache = null;

      return;
    }

    const response = await fetch(`${this.server}editTicket?id=${id}`, {
      method: 'PATCH',
      body: formData,
    });

    if (response.status === 204) {
      const trAll = this.container.querySelectorAll('tr');
      const tr = [...trAll].find((elm) => elm.dataset.id === id);
      const td = tr.querySelector('.item-title');

      td.textContent = name;

      const tdText = td.querySelector('.item-text');
      if (tdText) {
        tdText.textContent = description;
      }

      this.cache = null;
      e.target.remove();
    }
  }
}
