import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';

@Component({
    selector: 'app-servicos',
    templateUrl: './servicos.component.html',
    styleUrls: ['./servicos.component.css']
})
export class ServicosComponent implements OnInit {
    db: AngularFirestore;
    private basePath = '/uploads';
    closeResult: string = '';
    errorResult: string = '';
    service: any;
    progress = 0;

    servicos: Servico[];
    servico = {
        id: '',
        titulo: '',
        foto: '',
        descricao: '',
        status: ''
    };

    servicoCollection: AngularFirestoreCollection<Servico>;

    selectedFile = null;

    constructor(
        db: AngularFirestore,
        private modalService: NgbModal,
        private afs: AngularFirestore) {
        this.db = db;
        this.servicoCollection = this.afs.collection<Servico>('servicos');
        this.servicoCollection
            .valueChanges()
            .subscribe((data: Servico[]) => {
                this.servicos = data;
            });

    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    onFileSelected(event){
        this.selectedFile = event.target.files[0];
    }

    adicionar(content) {
        this.modalService.open(content)
            .result.then((result) => {

            if (this.servico.titulo.length <= 3) {
                alert('Informa o nome!');
                return;
            }

            if (this.selectedFile.length == 0) {
                alert('Selecione uma Imagem!');
                return;
            }

            this.setServico(this.servico).then((result) => {
                if (result) {
                    this.limpaServico();
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
        });
    }

    editar(content, _servico) {
        this.service = Object.assign({}, _servico);

        this.modalService.open(content).result.then((result) => {

            if (this.selectedFile.length == 0) {
                alert('Selecione uma Imagem!');
                return;
            }

            this.updateServico(this.service).then((result) => {
                this.limpaServico();
                if (result) {
                    this.closeResult = 'Salvo com Sucesso!';
                } else {
                    this.errorResult = 'Falha ao cadastrar!';
                }
            });
        }, (reason) => {
            this.limpaServico();
        });
    }

    deletar(content, _servico) {
        this.deleteServico(content, _servico).then((result) => {
            this.limpaServico();
            if (result) {
                this.closeResult = 'Deletado com Sucesso!';
            } else {
                this.errorResult = 'Falha ao Deletar!';
            }
        });
    }

    limpaServico() {
        this.closeResult = '';
        this.errorResult = '';
        this.selectedFile = null;

        this.servico = {
            id: '',
            titulo: '',
            foto: '',
            descricao: '',
            status: ''
        };
    }

    enviaImagem(_servico){
        return new Promise((resolve, reject) => {
            const storageRef = firebase.storage().ref();
            const uploadTask = storageRef.child(`${this.basePath}/${this.db.createId()}`)
                .put(this.selectedFile);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    this.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
                },

                (error) => {
                    alert("Erro: " + error);
                    resolve(false);
                },
                (): any => {
                    _servico.foto = uploadTask.snapshot.downloadURL;
                    resolve(true);
                });
        });
    }

    setServico(_servico) {
        return new Promise((resolve, reject) => {
            this.servico.id = this.db.createId();
            this.servico.titulo = _servico.titulo;
            this.servico.status = 'ativo';


            if(this.selectedFile != null)
            {
                this.enviaImagem(_servico).then( (result) => {
                    this.servico.foto = _servico.foto;
                    if(!result) {
                        resolve(false);
                        return;
                    }

                    this.servicoCollection.doc(this.servico.id).set(this.servico)
                        .then(data => {
                            resolve(true);
                        }).catch(ex => {
                        resolve(false);
                    });

                });
            }
        });
    }

    updateServico(_servico) {
        return new Promise((resolve, reject) => {
            if(this.selectedFile != null)
            {
                this.enviaImagem(_servico).then( (result) => {
                    this.servico.foto = _servico.foto;
                    if (!result) {
                        resolve(false);
                        return;
                    }
                    this.servicoCollection.doc(_servico.id).update(_servico)
                        .then(data => {
                            resolve(true);
                        }).catch(ex => {
                        resolve(false);
                    });
                });
            }
        });
    }

    deleteServico (content, _servico) {
        this.servico = _servico;
        console.log(this.servico);
        return new Promise((resolve, reject) => {
            this.modalService.open(content, {backdropClass: 'light-red-backdrop'})
                .result.then((result) => {
                this.servicoCollection.doc(_servico.id).delete().then(() => {
                    resolve(true);
                    this.limpaServico();
                    this.closeResult = 'Deletado com Sucesso!';
                }).catch(() => {
                    resolve(false);
                    this.limpaServico();
                    this.errorResult = 'Falha ao deletar!';
                });
            }, (reason) => {
                resolve(false);
            });
        });
    }

}


interface Servico {
    id: string;
    titulo: string;
    foto: string;
    descricao: string;
    status: string;
}
