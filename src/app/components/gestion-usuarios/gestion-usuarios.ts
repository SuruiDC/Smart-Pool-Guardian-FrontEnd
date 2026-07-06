import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NavbarComponent } from '../dashboard-main/navbar-component/navbar-component';
import { SidebarComponent } from '../dashboard-main/sidebar-component/sidebar-component';
import { UsuarioService } from '../../services/usuario-service';
import { UsuarioRequestDTO } from '../../models/request/UsuarioRequestDTO';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css',
})
export class GestionUsuarios implements OnInit {

  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  idUsuario = 0;
  role: string = '';

  filtroBusqueda = '';
  filtroRol = '';
  filtroEstado = '';

  mostrarModal = signal<boolean>(false);
  form = {
    nombreUsuario: '',
    email: '',
    password: '',
    numeroCelular: '',
    rolId: 1,
    activo: true
  };

  private platformId = inject(PLATFORM_ID);

  constructor(private uS: UsuarioService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = sessionStorage.getItem('token');
    if (!token) return;
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    this.idUsuario = Number(decoded.id);
    this.role = decoded.roles ?? '';
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.uS.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
      },
      error: (err) => console.error(err)
    });
  }

  

  filtrar() {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const matchBusqueda = !this.filtroBusqueda ||
        u.nombreUsuario?.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        u.email?.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      const matchRol = !this.filtroRol ||
        String(u.rol?.rolId) === this.filtroRol;

      const matchEstado = !this.filtroEstado ||
        String(u.activo) === this.filtroEstado;

      return matchBusqueda && matchRol && matchEstado;
    });
  }

  nombreRol(rolId: number): string {
    const roles: { [key: number]: string } = {
      1: 'USER',
      3: 'DESARROLLADOR',
      2: 'ADMIN'
    };
    return roles[rolId] ?? '—';
  }

  iniciales(nombre: string): string {
    if (!nombre) return '??';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }

  abrirModal() {
    console.log('abrirModal llamado');
    this.form = { nombreUsuario: '', email: '', password: '', numeroCelular: '', rolId: 1, activo: true };
    this.mostrarModal.set(true);
    console.log('mostrarModal:', this.mostrarModal());
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

 registrar() {
  console.log('registrar llamado', this.form);
  if (!this.form.nombreUsuario || !this.form.email || !this.form.password || !this.form.numeroCelular) return;

  const dto = new UsuarioRequestDTO();
  dto.nombreUsuario = this.form.nombreUsuario;
  dto.email = this.form.email;
  dto.password = this.form.password;
  dto.numeroCelular = this.form.numeroCelular;
  dto.rolId = this.form.rolId;
  dto.activo = true;

  this.uS.insertRol(dto).subscribe({
    next: () => {
      this.cerrarModal();
      this.cargarUsuarios();
    },
    error: (err) => console.error(err)
  });
}

  editar(usuario: any) {
    console.log('Editar:', usuario);
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.uS.eliminar(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => console.error(err)
    });
  }

  isDev(): boolean {
    return this.role.includes('DEV');
  }
}