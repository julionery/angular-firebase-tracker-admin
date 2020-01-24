import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-frotas',
    templateUrl: './frotas.component.html',
    styleUrls: ['./frotas.component.css']
})
export class FrotasComponent implements OnInit {
    private sub: any;
    closeResult: string = '';
    errorResult: string = '';
    id_cliente: string = '';
    nome_cliente: string = '';
    bus: any;
    clientes: Cliente[];

    db: AngularFirestore;
    frotaCollection: AngularFirestoreCollection<Frota>;

    frotas: Frota[];
    onibus = {
        codigo: '',
        nome: '',
        rota_padrao: '',
        status: '',
        cliente_codigo: '',
        lat: 0,
        lng: 0,
        data_atualizacao: ''
    };

    constructor(private modalService: NgbModal,
                db: AngularFirestore,
                private route: ActivatedRoute,
                private router: Router) {
        this.db = db;
        this.frotaCollection = db.collection<Frota>('frota');
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id_cliente = params['id'];
            this.nome_cliente = params['nome'];

            this.db.collection('frota', ref => ref.where('cliente_codigo', '==', this.id_cliente)
                .orderBy('nome')).valueChanges()
                .subscribe((data: Frota[]) => {
                    this.frotas = data;
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    abrir(_onibus) {
        this.router.navigate(['/rotas', _onibus.codigo, _onibus.nome]);
    }

    voltar() {
        history.back();
    }

    adicionar(content) {
        this.modalService.open(content)
            .result.then((result) => {

            if (this.onibus.codigo.length <= 3) {
                alert('Informa o codigo!');
                return;
            }

            if (this.onibus.nome.length <= 3) {
                alert('Informa o nome!');
                return;
            }
            this.setFrota(this.onibus).then((result) => {
                if (result) {
                    this.limpaOnibus();
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
        });
    }

    editar(content, _onibus) {
        this.bus = Object.assign({}, _onibus);

        this.modalService.open(content).result.then((result) => {
            if (this.bus.codigo.length <= 3) {
                alert('Informa o codigo!');
                return;
            }
            if (this.bus.nome.length <= 3) {
                alert('Informa o nome!');
                return;
            }
            this.updateFrota(this.bus).then((result) => {
                this.limpaOnibus();
                if (result) {
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
            this.limpaOnibus();
        });
    }

    deletar(content, _onibus) {
        this.deleteFrota(content, _onibus).then((result) => {
            this.limpaOnibus();
            if (result) {
                this.closeResult = 'Deletado com Sucesso!';
            } else {
                this.errorResult = 'Falha ao Deletar!';
            }
        });
    }

    limpaOnibus() {
        this.closeResult = '';
        this.errorResult = '';

        this.onibus = {
            codigo: '',
            nome: '',
            rota_padrao: '',
            status: '',
            cliente_codigo: '',
            lat: 0,
            lng: 0,
            data_atualizacao: ''
        };
    }

    setFrota(_onibus) {
        return new Promise((resolve, reject) => {
            this.onibus.codigo = _onibus.codigo;
            this.onibus.nome = _onibus.nome;
            this.onibus.status = 'ativo';
            this.onibus.cliente_codigo = this.id_cliente;
            this.frotaCollection.doc(this.onibus.codigo).set(this.onibus)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    updateFrota(_onibus) {
        return new Promise((resolve, reject) => {
            this.frotaCollection.doc(_onibus.codigo).update(_onibus)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    deleteFrota(content, _onibus) {
        this.onibus = _onibus;
        return new Promise((resolve, reject) => {
            this.modalService.open(content, {backdropClass: 'light-red-backdrop'})
                .result.then((result) => {
                this.frotaCollection.doc(_onibus.codigo).delete().then(() => {
                    resolve(true);
                    this.limpaOnibus();
                    this.closeResult = 'Deletado com Sucesso!';
                }).catch(() => {
                    resolve(false);
                    this.limpaOnibus();
                    this.errorResult = 'Falha ao deletar!';
                });
            }, (reason) => {
                resolve(false);
            });
        });
    }

    trocar(content, _onibus) {
        this.db.collection('clientes', ref => ref
            .orderBy('nome')).valueChanges()
            .subscribe((data: Cliente[]) => {
                this.clientes = data;
            });

        this.modalService.open(content).result.then((result) => {
            _onibus.cliente_codigo = result;
            this.frotaCollection.doc(_onibus.codigo).update(_onibus)
                .then(data => {
                    this.closeResult = 'Transferido com Sucesso ao Cliente: ' + result;
                }).catch(ex => {
                this.errorResult = 'Falha ao transferir!';
            });

        }, (reason) => {
            this.limpaOnibus();
        });
    }
}

interface Cliente {
    codigo: string;
    nome: string;
    endereco: string;
    telefone: number;
    status: string;
}

interface Frota {
    codigo: string;
    nome: string;
    cliente_codigo: string;
    lat: number;
    lng: number;
    data_atualizacao: string;
    rota_padrao: string;
    status: string;
}