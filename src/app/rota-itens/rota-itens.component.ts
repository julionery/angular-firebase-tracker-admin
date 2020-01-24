import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

@Component({
    selector: 'app-rota-itens',
    templateUrl: './rota-itens.component.html',
    styleUrls: ['./rota-itens.component.css']
})
export class RotaItensComponent implements OnInit {
    private sub: any;
    closeResult: string = '';
    errorResult: string = '';
    id_rota: string = '';
    nome_rota: string = '';
    route_item: any;

    db: AngularFirestore;
    rotaItensCollection: AngularFirestoreCollection<RotaItens>;

    rota_itens: RotaItens[];
    rota_item = {
        codigo: '',
        rota_codigo: '',
        ordem: 0,
        lat: 0,
        lng: 0
    };

    constructor(private modalService: NgbModal,
                db: AngularFirestore,
                private route: ActivatedRoute,
                private router: Router) {
        this.db = db;
        this.rotaItensCollection = db.collection<RotaItens>('rota_itens');
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id_rota = params['id'];
            this.nome_rota = params['nome'];

            this.db.collection('rota_itens', ref => ref.where('rota_codigo', '==', this.id_rota)
                .orderBy('ordem')).valueChanges()
                .subscribe((data: RotaItens[]) => {
                    this.rota_itens = data;
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    voltar() {
        history.back();
    }


    adicionar(content) {
        this.modalService.open(content)
            .result.then((result) => {

            if (this.rota_item.lat == 0) {
                alert('Informa a Latitude!');
                return;
            }
            if (this.rota_item.lng == 0) {
                alert('Informa a Longitude!');
                return;
            }

            this.setRotaItem(this.rota_item).then((result) => {
                if (result) {
                    this.limpaRotaItens();
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
        });
    }

    editar(content, _rotaItem) {
        this.route_item = Object.assign({}, _rotaItem);

        this.modalService.open(content).result.then((result) => {
            if (this.route_item.lat == 0) {
                alert('Informa a Latitude!');
                return;
            }
            if (this.route_item.lng == 0) {
                alert('Informa a Longitude!');
                return;
            }

            this.updateRotaItem(this.route_item).then((result) => {
                this.limpaRotaItens();
                if (result) {
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
            this.limpaRotaItens();
        });
    }

    deletar(content, _rotaItem) {
        this.deleteRota(content, _rotaItem).then((result) => {
            this.limpaRotaItens();
            if (result) {
                this.closeResult = 'Deletado com Sucesso!';
            } else {
                this.errorResult = 'Falha ao Deletar!';
            }
        });
    }

    limpaRotaItens() {
        this.closeResult = '';
        this.errorResult = '';

        this.rota_item = {
            codigo: '',
            rota_codigo: '',
            ordem: 0,
            lat: 0,
            lng: 0
        };
    }

    setRotaItem(_rotaItem) {
        return new Promise((resolve, reject) => {
            this.rota_item.codigo = this.db.createId();
            this.rota_item.ordem = this.rota_itens.reverse()[0].ordem + 1;
            this.rota_item.lat = _rotaItem.lat;
            this.rota_item.lng = _rotaItem.lng;
            this.rota_item.rota_codigo = this.id_rota;

            this.rotaItensCollection.doc(this.rota_item.codigo).set(this.rota_item)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    updateRotaItem(_rotaItem) {
        return new Promise((resolve, reject) => {
            this.rotaItensCollection.doc(_rotaItem.codigo).update(_rotaItem)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    deleteRota(content, _rotaItem) {
        this.rota_item = _rotaItem;
        return new Promise((resolve, reject) => {
            this.modalService.open(content, {backdropClass: 'light-red-backdrop'})
                .result.then((result) => {
                this.rotaItensCollection.doc(_rotaItem.codigo).delete().then(() => {
                    resolve(true);
                    this.limpaRotaItens();
                    this.closeResult = 'Deletado com Sucesso!';
                }).catch(() => {
                    resolve(false);
                    this.limpaRotaItens();
                    this.errorResult = 'Falha ao deletar!';
                });
            }, (reason) => {
                resolve(false);
            });
        });
    }

}

interface RotaItens {
    codigo: string;
    rota_codigo: string;
    ordem: number;
    lat: number;
    lng: number;
}

