import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-empresa',
    templateUrl: './empresa.component.html',
    styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
    db: AngularFirestore;
    closeResult: string = '';
    errorResult: string = '';
    emp: any;

    empresas: Empresa[];
    empresa = {
        id: '',
        titulo: '',
        subtitulo: '',
        descricao: '',
        horario_funcionamento: '',
        endereco: '',
        telefone1: '',
        telefone2: '',
        email: '',
        email2: '',
        mapa: '',
        whatsapp: '',
        latitude: '',
        longitude: '',
        status: ''
    };

    empresaCollection: AngularFirestoreCollection<Empresa>;

    constructor(
                db: AngularFirestore,
                private modalService: NgbModal,
                private afs: AngularFirestore) {
        this.db = db;
        this.empresaCollection = this.afs.collection<Empresa>('empresas', ref => ref.orderBy('titulo'));
        this.empresaCollection
            .valueChanges()
            .subscribe((data: Empresa[]) => {
                this.empresas = data;
            });

    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    adicionar(content) {
        this.modalService.open(content)
            .result.then((result) => {

            this.setEmpresa(this.empresa).then((result) => {
                if (result) {
                    this.limpaEmpresa();
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
        });
    }

    editar(content, _empresa) {
        this.emp = Object.assign({}, _empresa);

        this.modalService.open(content).result.then((result) => {
            this.updateEmpresa(this.emp).then((result) => {
                this.limpaEmpresa();
                if (result) {
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
            this.limpaEmpresa();
        });
    }

    deletar(content, _empresa) {
        this.deleteEmpresa(content, _empresa).then((result) => {
            this.limpaEmpresa();
            if (result) {
                this.closeResult = 'Deletado com Sucesso!';
            } else {
                this.errorResult = 'Falha ao Deletar!';
            }
        });
    }

    limpaEmpresa() {
        this.closeResult = '';
        this.errorResult = '';

        this.empresa = {
            id: '',
            titulo: '',
            subtitulo: '',
            descricao: '',
            horario_funcionamento: '',
            endereco: '',
            telefone1: '',
            telefone2: '',
            email: '',
            email2: '',
            mapa: '',
            whatsapp: '',
            latitude: '',
            longitude: '',
            status: ''
        };
    }

    setEmpresa(_empresa) {
        return new Promise((resolve, reject) => {
            this.empresa.id = this.db.createId();
            this.empresa.titulo = _empresa.titulo;
            this.empresa.status = 'ativo';


            this.empresaCollection.doc(this.empresa.id).set(this.empresa)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    updateEmpresa(_empresa) {
        return new Promise((resolve, reject) => {
            this.empresaCollection.doc(_empresa.id).update(_empresa)
                .then(data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

    deleteEmpresa(content, _empresa) {
        this.empresa = _empresa;
        return new Promise((resolve, reject) => {
            this.modalService.open(content, {backdropClass: 'light-red-backdrop'})
                .result.then((result) => {
                this.empresaCollection.doc(_empresa.id).delete().then(() => {
                    resolve(true);
                    this.limpaEmpresa();
                    this.closeResult = 'Deletado com Sucesso!';
                }).catch(() => {
                    resolve(false);
                    this.limpaEmpresa();
                    this.errorResult = 'Falha ao deletar!';
                });
            }, (reason) => {
                resolve(false);
            });
        });
    }

}


interface Empresa {
    id: string;
    titulo: string;
    subtitulo: string;
    descricao: string;
    horario_funcionamento: string;
    endereco: string;
    telefone1: string;
    telefone2: string;
    email: string;
    email2: string;
    mapa: string;
    whatsapp: string;
    latitude: string;
    longitude: string;
    status: string;
}

