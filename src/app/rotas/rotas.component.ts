import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-rotas',
    templateUrl: './rotas.component.html',
    styleUrls: ['./rotas.component.css']
})
export class RotasComponent implements OnInit {
    private sub: any;
    closeResult: string = '';
    errorResult: string = '';
    id_frota: string = '';
    nome_frota: string = '';
    bus_route: any;

    db: AngularFirestore;
    rotaCollection: AngularFirestoreCollection<Rota>;

    rotas: Rota[];
    rota = {
        codigo: '',
        nome: '',
        status: '',
        frota_codigo: '',
    };

    constructor(private modalService: NgbModal,
                db: AngularFirestore,
                private route: ActivatedRoute,
                private router: Router) {
        this.db = db;
        this.rotaCollection = db.collection<Rota>('rotas');
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id_frota = params['id'];
            this.nome_frota = params['nome'];

            this.db.collection('rotas', ref => ref.where('frota_codigo', '==', this.id_frota)
                .orderBy('nome')).valueChanges()
                .subscribe((data: Rota[]) => {
                    this.rotas = data;
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    abrir(_rota) {
        this.router.navigate(['/rota-itens', _rota.codigo, _rota.nome]);
    }

    voltar(){
        history.back();
    }



    adicionar(content) {
        this.modalService.open(content)
            .result.then((result) => {

            if (this.rota.nome.length <= 3){
                alert('Informa o nome!');
            return;
        }
            this.setRota(this.rota).then((result) => {
                if (result) {
                    this.limpaRota();
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
        });
    }

    editar(content, _rota) {
        this.bus_route = Object.assign({}, _rota);

        this.modalService.open(content).result.then((result) => {
            if (this.bus_route.nome.length <= 3) {
                alert('Informa o nome!');
                return;
            }

            this.updateRota(this.bus_route).then((result) => {
                this.limpaRota();
                if (result) {
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
            this.limpaRota();
        });
    }

    deletar(content, _rota) {
        this.deleteRota(content, _rota).then((result) => {
            this.limpaRota();
            if (result) {
                this.closeResult = 'Deletado com Sucesso!';
            } else {
                this.errorResult = 'Falha ao Deletar!';
            }
        });
    }

    limpaRota() {
        this.closeResult = '';
        this.errorResult = '';

        this.rota = {
            codigo: '',
            nome: '',
            status: '',
            frota_codigo: ''
        };
    }

    setRota(_rota) {
        return new Promise((resolve, reject) => {
            this.rota.codigo = this.db.createId();
            this.rota.nome = _rota.nome;
            this.rota.status = 'ativo';
            this.rota.frota_codigo = this.id_frota;

            this.rotaCollection.doc(this.rota.codigo).set(this.rota)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    updateRota(_rota) {
        return new Promise((resolve, reject) => {
            this.rotaCollection.doc(_rota.codigo).update(_rota)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    deleteRota(content, _rota) {
        this.rota = _rota;
        return new Promise((resolve, reject) => {
            this.modalService.open(content, {backdropClass: 'light-red-backdrop'})
                .result.then((result) => {
                this.rotaCollection.doc(_rota.codigo).delete().then(() => {
                    resolve(true);
                    this.limpaRota();
                    this.closeResult = 'Deletado com Sucesso!';
                }).catch(() => {
                    resolve(false);
                    this.limpaRota();
                    this.errorResult = 'Falha ao deletar!';
                });
            }, (reason) => {
                resolve(false);
            });
        });
    }

}

interface Rota {
    codigo: string;
    frota_codigo: string;
    nome: string;
    status: string;
}

