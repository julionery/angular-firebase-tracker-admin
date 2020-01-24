import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-fale-conosco',
  templateUrl: './fale-conosco.component.html',
  styleUrls: ['./fale-conosco.component.css']
})
export class FaleConoscoComponent implements OnInit {
    db: AngularFirestore;
    closeResult: string = '';
    errorResult: string = '';

    item: any;
    fale_conosco = {
        email: '',
        telefone: '',
        site: '',
        instagran: '',
        facebook: ''
    };

    constructor(private afs: AngularFirestore) {
        this.afs.collection('configuracoes').doc('fale_conosco').valueChanges()
            .subscribe((data: FaleConosco[]) => {
                this.item = data;
                this.fale_conosco.email = this.item.email;
                this.fale_conosco.telefone = this.item.telefone;
                this.fale_conosco.site = this.item.site;
                this.fale_conosco.instagran = this.item.instagran;
                this.fale_conosco.facebook = this.item.facebook;
            });
    }

    ngOnInit() {
    }

    salvar() {
        this.updateFrota(this.fale_conosco).then((result) => {
            if (result) {
                this.closeResult = 'Salvo com Sucesso!';
            } else {
                this.errorResult = 'Falha ao cadastrar!';
            }
        });
    }

    updateFrota(_fale_conosco) {
        return new Promise((resolve, reject) => {
            this.afs.collection('configuracoes').doc('fale_conosco').update(_fale_conosco)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }
}

interface FaleConosco {
    email: string;
    telefone: string;
    site: string;
    instagran: string;
    facebook: string;
}
