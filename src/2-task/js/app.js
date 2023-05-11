import Ticket from './Ticket';

const ticket = new Ticket('.container', 'http://localhost:3000/api/');
ticket.start();
