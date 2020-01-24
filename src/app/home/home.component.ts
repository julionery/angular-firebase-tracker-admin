import { Component } from '@angular/core';

import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

    lat: number;
    lng: number;

    init = false;

    frotas: Frota[] = [];
    rota: Rota[] = [];
    siguiendoA: string = null;
    seguindoNome: string = null;
    seguindoData: string = null;
    seguindoRota: string = null;

    db: AngularFirestore;

    constructor(db: AngularFirestore) {
        this.db = db;

        db.collection('frota').valueChanges()
            .subscribe((data: Frota[]) => {

                this.frotas = data;

                if (!this.init) {
                    this.lat = data[0].lat;
                    this.lng = data[0].lng;
                    this.init = true;
                }

                if (this.siguiendoA) {
                    data.forEach(usuario => {
                        if (usuario.chave === this.siguiendoA) {
                            this.lat = usuario.lat;
                            this.lng = usuario.lng;
                        }
                    });
                }
            });
    }

    seguir(e:any, frota: Frota, rota) {
        e.preventDefault();
        this.siguiendoA = frota.codigo;
        this.seguindoNome = frota.nome;
        this.seguindoData = frota.data_atualizacao;

        this.lat = frota.lat;
        this.lng = frota.lng;

        if (rota)
            this.addRota(frota, rota);
    }

    addRota(frota: Frota, rota) {
        this.siguiendoA = frota.codigo;
        this.rota = [];
        console.log(frota);
        console.log(rota);
        this.db.collection('rota_itens', ref => ref
            .where('frota_codigo', '==', this.siguiendoA)
            .where('rota_codigo', '==', rota))
            .valueChanges()
            .subscribe((data: Rota[]) => {
                this.rota = this.transform(data, 'ordem');
            });
    }

    dejarDeSeguir(e:any) {
        e.preventDefault();

        this.siguiendoA = null;
        this.seguindoNome = null;
        this.seguindoData = null;
        this.rota = [];
    }

    transform(array: any[], field: string): any[] {
        array.sort((a: any, b: any) => {
            if (a[field] < b[field]) {
                return -1;
            } else if (a[field] > b[field]) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}

interface Usuario {
    codigo: string;
    nome: string;
    telefone: string;
    endereco: string;
    status: string;
    tipo: string;
    lat: number;
    lng: number;
    data_atualizacao: string;
    codigo_cliente: string;
    codigo_frota: string;
    codigo_rota: string;
}

interface Cliente {
    codigo: string;
    nome: string;
    endereco: string;
    telefone: number;
}

interface Frota {
    id: string;
    codigo: string;
    nome: string;
    chave: string;
    lat: number;
    lng: number;
    data_atualizacao: string;
    rota_padrao: string;
}

interface Rota {
    id: string;
    codigo: string;
    frota_codigo: string;
    nome: string;
    lat: number;
    lng: number;
}
