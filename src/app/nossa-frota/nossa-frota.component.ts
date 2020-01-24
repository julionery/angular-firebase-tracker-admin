import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';

@Component({
    selector: 'app-nossa-frota',
    templateUrl: './nossa-frota.component.html',
    styleUrls: ['./nossa-frota.component.css']
})
export class NossaFrotaComponent implements OnInit {
    db: AngularFirestore;
    private basePath = '/uploads';
    closeResult: string = '';
    errorResult: string = '';
    progress = 0;
    selectedFile = null;

    photos: any;

    fotos: FotoFrota[];
    foto = {
        id: '',
        titulo: '',
        foto: '',
        ordem: 0,
        status: ''
    };

    servicoCollection: AngularFirestoreCollection<FotoFrota>;

    constructor(
        db: AngularFirestore,
        private modalService: NgbModal,
        private afs: AngularFirestore) {
        this.db = db;
        this.servicoCollection = this.afs.collection<FotoFrota>('fotos_frota');
        this.servicoCollection
            .valueChanges()
            .subscribe((data: FotoFrota[]) => {
                this.fotos = data;
            });

    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    onFileSelected(event){
        this.selectedFile = event.target.files[0];
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

    adicionar(content) {
        this.modalService.open(content)
            .result.then((result) => {

            if (this.selectedFile.length == 0) {
                alert('Selecione uma Imagem!');
                return;
            }
            this.setServico(this.foto).then((result) => {
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

    editar(content, _foto) {
        this.photos = Object.assign({}, _foto);

        this.modalService.open(content).result.then((result) => {
            if (this.selectedFile.length == 0) {
                alert('Selecione uma Imagem!');
                return;
            }

            this.updateServico(this.photos).then((result) => {
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

    deletar(content, _foto) {
        this.deleteServico(content, _foto).then((result) => {
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

        this.foto = {
            id: '',
            titulo: '',
            foto: '',
            ordem: 0,
            status: ''
        };
    }

    setServico(_foto) {
        return new Promise((resolve, reject) => {
            this.foto.id = this.db.createId();
            this.foto.titulo = _foto.titulo;
            this.foto.status = 'ativo';
            this.foto.ordem = this.fotos.reverse()[0].ordem + 1;

            if(this.selectedFile != null)
            {
                this.enviaImagem(_foto).then( (result) => {
                    this.foto.foto = _foto.foto;
                    if(!result) {
                        resolve(false);
                        return;
                    }

                    this.servicoCollection.doc(this.foto.id).set(this.foto)
                        .then(data => {
                            resolve(true);
                        }).catch(ex => {
                        resolve(false);
                    });

                });
            }
        });
    }

    updateServico(_foto) {
        return new Promise((resolve, reject) => {

            if(this.selectedFile != null)
            {
                this.enviaImagem(_foto).then( (result) => {
                    this.foto.foto = _foto.foto;
                    if (!result) {
                        resolve(false);
                        return;
                    }
                    this.servicoCollection.doc(_foto.id).update(_foto)
                        .then(data => {
                            resolve(true);
                        }).catch(ex => {
                        resolve(false);
                    });
                });
            }
        });
    }

    deleteServico(content, _foto) {
        this.foto = _foto;
        return new Promise((resolve, reject) => {
            this.modalService.open(content, {backdropClass: 'light-red-backdrop'})
                .result.then((result) => {
                this.servicoCollection.doc(_foto.id).delete().then(() => {
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


interface FotoFrota {
    id: string;
    titulo: string;
    foto: string;
    ordem: number;
    status: string;
}
