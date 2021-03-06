import {Component} from '@angular/core';
import {NavController, Nav, LoadingController} from 'ionic-angular';
// import {TranslateService} from 'ng2-translate';
import {Facebook, NativeStorage, BackgroundGeolocation, GooglePlus} from 'ionic-native';
import {MainService} from "../../app/main.service";
import {PrincipalPage} from "../principal/principal";
import {UserData} from "./user-data";
import {Config} from "../../app/config";


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {

    public rootPage: any;
    public local: any;
    googleReverseClientId;

    lenguaje: String = 'Español';

    constructor(public navController: NavController,
                public nav: Nav,
                public loadingCtrl: LoadingController,
                public mainService: MainService,
                public userData: UserData,
                _config: Config) {


        this.googleReverseClientId = _config.get('googleReverseClientId');

    }

    ngOnInit() {
    }




    loginFacebook() {
        Facebook.login(['public_profile', 'email'])
            .then(rta => {
                console.log(rta.status)
                if (rta.status == 'connected') {
                    Facebook.api('/me?fields=id,name,email,first_name,last_name,gender', [])
                        .then(rta => {
                            console.log("rta", JSON.stringify(rta));
                            console.log("userid", rta.id);
                            Facebook.api('/me/picture?type=large&redirect=false', [])
                                .then(pictureData => {
                                    console.log("pictureData", JSON.stringify(pictureData));
                                    let user = {
                                        avatar: pictureData.data.url,
                                        sexo: rta.gender,
                                        nombre: rta.first_name,
                                        apellido: rta.last_name,
                                        email: rta.email,
                                        fbId: rta.id

                                    };

                                    this.crearPerfil(user);


                                })
                                .catch(error => {
                                    console.error("fbpicture", error);
                                    console.error("fbpicture", JSON.stringify(error));
                                });
                        })
                        .catch(error => {
                            console.error('api', JSON.stringify(error));
                        });
                }
                ;
            })
            .catch(error => {
                console.error(error);
                console.error('login', JSON.stringify(error));
            });
    }

    crearPerfil(user) {

        let loader = this.loadingCtrl.create({
            content: "Ingresando a EvenProm",
            // duration: 6000
        });
        loader.present();

        this.mainService.postPerfil(user).subscribe(
            data => {
                console.log("Register Data", JSON.stringify(data));

                user = {
                    avatar: user.avatar,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    fbId: user.fbId,
                    userID: data.id,
                    sexo: data.sexo

                };

                NativeStorage.setItem('userData', user)
                    .then(
                        () => {
                            //envia a la pantalla principal
                            // this.redirectPrincipal(setDataValues.isNew);


                            loader.dismissAll();
                            this.userData.signup(user);
                            this.nav.setRoot(PrincipalPage);


                        },
                        error => alert(JSON.stringify(error))
                    );


            },
            error => {
                console.log(JSON.stringify(error));
                Facebook.logout();
                GooglePlus.logout();
                NativeStorage.remove('userData');
                BackgroundGeolocation.stop();
                loader.dismissAll();
                this.rootPage = LoginPage;
            }
        );

    }

    loginGoogle() {
        // GooglePlus.trySilentLogin();
        GooglePlus.login({
            'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
            'webClientId': this.googleReverseClientId,
            'offline': true
        })
            .then(
                rta => {
                    console.log("rta", JSON.stringify(rta));
                    let user = {
                        avatar: rta.imageUrl,
                        sexo: rta.gender,
                        nombre: rta.givenName,
                        apellido: rta.familyName,
                        email: rta.email,
                        gId: rta.userId

                    };

                    this.crearPerfil(user);
                }
            )
            .catch(error => {
                console.error(error);
                console.error('login google', JSON.stringify(error));
            })
        ;
    }

    omitir() {
        this.nav.setRoot(PrincipalPage);
    }
}
