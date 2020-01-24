import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
    closeResult: string = '';
    errorResult: string = '';

    db: AngularFirestore;
    clientes: Cliente[];

    clienteCollection: AngularFirestoreCollection<Cliente>;
    cliente = {
        codigo: '',
        nome: '',
        telefone: '',
        endereco: '',
        status: ''
    };

    client: any;

    constructor(private modalService: NgbModal,
                db: AngularFirestore,
                private router: Router,) {
        this.db = db;
        this.clienteCollection = db.collection<Cliente>('clientes');

        db.collection('clientes', ref => ref
            .orderBy('nome')).valueChanges()
            .subscribe((data: Cliente[]) => {
                this.clientes = data;
            });
    }

    ngOnInit() {
    }

    abrir(_cliente) {
        this.router.navigate(['/frotas', _cliente.codigo, _cliente.nome]);
    }

    adicionar(content) {
        this.modalService.open(content)
            .result.then((result) => {

            if (this.cliente.codigo.length <= 3) {
                alert('Informa o codigo!');
                return;
            }
            if (this.cliente.nome.length <= 3) {
                alert('Informa o nome!');
                return;
            }
            this.setCliente(this.cliente).then(() => {
                    this.limpaCliente();
                    this.closeResult = 'Adicionado com Sucesso!';
                }
            ).catch(() => {
                this.errorResult = 'Falha ao cadastrar!';
            });
        }, (reason) => {
        });
    }


    editar(content, cliente) {
        this.client = Object.assign({}, cliente);

        this.modalService.open(content).result.then((result) => {
            let _cliente = cliente;

            if (_cliente.codigo.length <= 3) {
                alert('Informa o codigo!');
                return;
            }

            if (_cliente.nome.length <= 3) {
                alert('Informa o nome!');
                return;
            }

            this.updateCliente(_cliente, this.client).then(() => {
                    this.limpaCliente();
                    this.closeResult = 'Alterado com Sucesso!';
                }
            ).catch(() => {
                this.limpaCliente();
                this.errorResult = 'Falha ao cadastrar!';
            });

        }, (reason) => {
            this.limpaCliente();
        });
    }

    delete(content, _cliente) {
        this.deleteCliente(content, _cliente).then((result) => {
            this.limpaCliente();
            if (result) {
                this.closeResult = 'Salvo com Sucesso!';
            } else {
                this.errorResult = 'Falha ao Deletar!';
            }
        });

    }


    limpaCliente() {
        this.closeResult = '';
        this.errorResult = '';

        this.cliente = {
            codigo: '',
            nome: '',
            telefone: '',
            endereco: '',
            status: ''
        };
    }


    setCliente(clienteNew) {
        return new Promise((resolve, reject) => {
            this.cliente.codigo = clienteNew.codigo;
            this.cliente.nome = clienteNew.nome;
            this.cliente.telefone = clienteNew.telefone;
            this.cliente.endereco = clienteNew.endereco;
            this.cliente.status = 'ativo';

            this.clienteCollection.doc(clienteNew.codigo).set(this.cliente)
                .then(data => {
                    console.log(data);
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    updateCliente(_cliente, cliente) {
        return new Promise((resolve, reject) => {
            this.clienteCollection.doc(_cliente.codigo).update(cliente)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    deleteCliente(content, cliente) {
        this.cliente = cliente;
        return new Promise((resolve, reject) => {
            this.modalService.open(content, {backdropClass: 'light-red-backdrop'})
                .result.then((result) => {
                this.clienteCollection.doc(cliente.codigo).delete().then(() => {
                    resolve(true);
                }).catch(() => {
                    resolve(false);
                });
            }, (reason) => {
                resolve(false);
            });
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