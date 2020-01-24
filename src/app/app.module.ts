import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AgmCoreModule} from '@agm/core';

import {AppComponent} from './app.component';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {HomeComponent} from './home/home.component';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FrotasComponent } from './frotas/frotas.component';
import { RotasComponent } from './rotas/rotas.component';
import { RotaItensComponent } from './rota-itens/rota-itens.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ConfigComponent } from './config/config.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { EmpresaComponent } from './empresa/empresa.component';
import { FaleConoscoComponent } from './fale-conosco/fale-conosco.component';
import { ServicosComponent } from './servicos/servicos.component';
import { NossaFrotaComponent } from './nossa-frota/nossa-frota.component';

const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'clientes', component: ClientesComponent},
    {path: 'usuarios', component: UsuariosComponent},
    {path: 'frotas/:id/:nome', component: FrotasComponent},
    {path: 'rotas/:id/:nome', component: RotasComponent},
    {path: 'rota-itens/:id/:nome', component: RotaItensComponent},
    {path: 'config', component: ConfigComponent},
    {path: 'config-empresa', component: EmpresaComponent},
    {path: 'config-servicos', component: ServicosComponent},
    {path: 'config-frota', component: NossaFrotaComponent},
    {path: 'config-fale-conosco', component: FaleConoscoComponent},
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        ClientesComponent,
        FrotasComponent,
        RotasComponent,
        RotaItensComponent,
        UsuariosComponent,
        ConfigComponent,
        EmpresaComponent,
        FaleConoscoComponent,
        ServicosComponent,
        NossaFrotaComponent
    ],
    imports: [
        BrowserModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBIZgaGBYSMqvi3iOy9lT2KH5Dl9JjdT_U'
        }),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        NgbModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
