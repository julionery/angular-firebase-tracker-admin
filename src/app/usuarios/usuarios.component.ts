import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

declare let $;

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.css'],
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .light-red-backdrop {
            background-color: rgba(255, 23, 33, 0.98);
        }
    `]
})
export class UsuariosComponent implements OnInit {
    closeResult: string = '';
    errorResult: string = '';

    db: AngularFirestore;
    usuarios: Usuario[];

    usuarioCollection: AngularFirestoreCollection<Usuario>;
    usuario = {
        codigo: '',
        nome: '',
        telefone: '',
        endereco: '',
        status: '',
        tipo: '',
        lat: 0,
        lng: 0,
        data_atualizacao: 0,
        codigo_cliente: '',
        codigo_frota: '',
        codigo_rota: ''
    };

    user: any;

    constructor(private modalService: NgbModal,
                db: AngularFirestore) {
        this.db = db;
        this.usuarioCollection = db.collection<Usuario>('usuarios');

        db.collection('usuarios').valueChanges()
            .subscribe((data: Usuario[]) => {
                this.usuarios = data;
            });
    }

    ngOnInit() {
    }

    adicionar(content) {
        this.modalService.open(content)
            .result.then((result) => {

            if (this.usuario.codigo.length <= 3) {
                alert('Informa o codigo!');
                return;
            }

            if (this.usuario.nome.length <= 3) {
                alert('Informa o nome!');
                return;
            }

            this.setUsuario(this.usuario).then(() => {
                    this.limpaUsuario();
                    this.errorResult = '';
                    this.closeResult = 'Adicionado com Sucesso!';
                }
            ).catch(() => {
                this.closeResult = '';
                this.errorResult = 'Falha ao cadastrar!';
            });
        }, (reason) => {
        });
    }


    editar(content, usuario) {
        this.user = Object.assign({}, usuario);

        this.modalService.open(content).result.then((result) => {
            let _user = usuario;

            if (_user.codigo.length <= 3) {
                alert('Informa o codigo!');
                return;
            }

            if (_user.nome.length <= 3) {
                alert('Informa o nome!');
                return;
            }

            this.updateUsuario(_user, this.user).then(() => {
                    this.limpaUsuario();
                    this.errorResult = '';
                    this.closeResult = 'Salvo com Sucesso!';
                }
            ).catch(() => {
                this.limpaUsuario();
                this.closeResult = '';
                this.errorResult = 'Falha ao cadastrar!';
            });

        }, (reason) => {
            this.limpaUsuario();
            this.closeResult = '';
            this.errorResult = '';
        });
    }

    delete(content, usuario) {
        this.usuario = usuario;
        this.modalService.open(content, {backdropClass: 'light-red-backdrop'})
            .result.then((result) => {
            this.usuarioCollection.doc(usuario.codigo).delete().then(() => {
                this.limpaUsuario();
                this.closeResult = 'Deletado com Sucesso!';
            }).catch(() => {
                this.limpaUsuario();
                this.errorResult = 'Falha ao deletar!';
            });
        }, (reason) => {
            this.limpaUsuario();
        });
    }

    limpaUsuario() {
        this.usuario = {
            codigo: '',
            nome: '',
            telefone: '',
            endereco: '',
            status: '',
            tipo: '',
            lat: 0,
            lng: 0,
            data_atualizacao: 0,
            codigo_cliente: '',
            codigo_frota: '',
            codigo_rota: ''
        };
    }

    setUsuario(usuarioI) {
        return new Promise((resolve, reject) => {
            this.usuario.codigo = usuarioI.codigo;
            this.usuario.nome = usuarioI.nome;
            this.usuario.telefone = usuarioI.telefone;
            this.usuario.endereco = usuarioI.endereco;
            this.usuario.lat = 0;
            this.usuario.lng = 0;
            this.usuario.data_atualizacao = Date.now();
            this.usuario.codigo_cliente = '';
            this.usuario.codigo_frota = '';
            this.usuario.codigo_rota = '';
            this.usuario.status = 'ativo';
            this.usuario.tipo = 'user';

            this.usuarioCollection.doc(usuarioI.codigo).set(this.usuario)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }


    updateUsuario(_user, usuario) {
        return new Promise((resolve, reject) => {
            this.usuarioCollection.doc(_user.codigo).update(usuario)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
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

