import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-universidad',
  templateUrl: './detalle-universidad.component.html',
  styleUrls: ['./detalle-universidad.component.css']
})
export class DetalleUniversidadComponent implements OnInit {

  constructor(private route:ActivatedRoute){}
  idUniversidad:string | null = null;

  ngOnInit(): void {
    this.idUniversidad = this.route.snapshot.paramMap.get('id');
    console.log(this.idUniversidad)
  }

}
