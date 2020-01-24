import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
    db: AngularFirestore;
    closeResult: string = '';
    errorResult: string = '';

    item: any;
    institucional = {
        institucional: '',
        missao: '',
        visao: '',
        valores: ''
    };

    constructor(private afs: AngularFirestore) {
        this.afs.collection('configuracoes').doc('institucional').valueChanges()
            .subscribe((data: Institucional[]) => {
                this.item = data;
                this.institucional.institucional = this.item.institucional;
                this.institucional.missao = this.item.missao;
                this.institucional.visao = this.item.visao;
                this.institucional.valores = this.item.valores;
            });
    }

    ngOnInit() {
    }

    salvar() {
        this.updateFrota(this.institucional).then((result) => {
            if (result) {
                this.closeResult = 'Salvo com Sucesso!';
            } else {
                this.errorResult = 'Falha ao cadastrar!';
            }
        });
    }

    updateFrota(_institucional) {
        return new Promise((resolve, reject) => {
            this.afs.collection('configuracoes').doc('institucional').update(_institucional)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }
}

interface Institucional {
    institucional: string;
    missao: string;
    visao: string;
    valores: string;
}
