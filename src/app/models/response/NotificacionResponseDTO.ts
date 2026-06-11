export class NotificacionResponseDTO {
  idNotificacion: number = 0;
  tipoNotificacion: string = '';
  mensaje: string = '';
  leido: boolean = false;
  fechaCreacion: Date = new Date();
  horaCreacion: string = ''; // se puede manejar como string (HH:mm:ss) o como Date si tu backend lo envía en formato ISO
  usuarioId: number = 0;
}
