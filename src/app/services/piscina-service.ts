import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PiscinasPorUsuarioDTO } from '../models/dtos/PiscinasPorUsuarioDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class PiscinaService {
  
  private urlPiscinas = `${base_url}/api/piscinas`;

  constructor(private http: HttpClient) {}

  listPiscinas(idUsuario: number) {
    return this.http.get<PiscinasPorUsuarioDTO[]>(`${this.urlPiscinas}/listar`, {
      params: {
        idUsuario: idUsuario.toString()
      }
    });
  }

}
