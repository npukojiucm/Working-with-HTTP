export default class Ticket {
  constructor(container, server) {
    this.container = document.querySelector(container);
    this.newTicketBtn = this.container.querySelector('.new-ticket');

    this.server = server;

    this.onClickBtnNewTicket = this.onClickBtnNewTicket.bind(this);

    this.onClickConfirmTask = this.onClickConfirmTask.bind(this);
  }

  start() {
    this.init();

    this.newTicketBtn.addEventListener('click', this.onClickBtnNewTicket);
  }

  init() {
    const table = this.container.querySelector('.tickets-list');
    const xhr = new XMLHttpRequest();

    const parametrs = '?method=allTickets';
    xhr.open('GET', this.server + parametrs);

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      const response = JSON.parse(xhr.responseText);

      response.tickets.forEach((ticket) => {
        this.showTicket(ticket, table);
      });
    }.bind(this);

    xhr.send();
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

    confirmBtn.addEventListener('click', this.onClickConfirmTask);
  }

  createModalWindow(parent) {
    return parent.insertAdjacentHTML('beforeend', `
    <form class="ticket__modal">
            <h1 class="modal-title">Добавить тикет</h1>

            <label for="short-description">Краткое описание</label>
            <input id="short-description" class="short-description" type="text">

            <label for="description">Подробное описание</label>
            <textarea id="description" class="description"></textarea>

            <input type="button" class="modal-btn btn-cancel" value="Отмена">
            <input type="button" class="modal-btn btn-confirm" value="Ок">

        </form>
    `);
  }

  onClickBtnNewTicket(e) {
    this.createModalWindow(this.container);
  }

  onClickConfirmTask(e) {
    const { target } = e;
    const parent = target.parentNode;

    const state = !!target.classList.contains('confirm-background');

    const parametrs = `?method=ticketConfirm&id=${parent.id}&state=${state}`;
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
}
