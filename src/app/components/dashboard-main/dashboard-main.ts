import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './sidebar-component/sidebar-component';
import { NavbarComponent } from './navbar-component/navbar-component';
import { PiscinaService } from '../../services/piscina-service';
import { ActivatedRoute, Router } from '@angular/router';
import { PiscinasPorUsuarioDTO } from "../../models/dtos/PiscinasPorUsuarioDTO"

@Component({
  selector: 'app-dashboard-main',
  imports: [SidebarComponent, NavbarComponent],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css',
})
export class DashboradMain implements OnInit {

  datasource: PiscinasPorUsuarioDTO[] = [];
  id: number = 0

  constructor(
    private route: ActivatedRoute,
    private pS: PiscinaService
  ) { }

  ngOnInit(): void {
    
    this.cargarPiscinas();

  }
  
  cargarPiscinas() {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.pS.listPiscinas(this.id).subscribe(data => {

      this.datasource = data;

    })

  }

}
