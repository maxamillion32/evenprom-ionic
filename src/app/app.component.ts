import {Component} from '@angular/core';
import {Platform, Events, LoadingController} from 'ionic-angular';
import {
    StatusBar, BackgroundGeolocation, Device, Push, Facebook, NativeStorage, AppRate,
    GooglePlus, Market, GoogleAnalytics
} from 'ionic-native';
import {PrincipalPage} from "../pages/principal/principal";
import {LoginPage} from "../pages/login/login";
import {FavoritosPage} from "../pages/favoritos/favoritos";
import {TuEmpresaAquiPage} from "../pages/tu-empresa-aqui/tu-empresa-aqui";
import {ContactoPage} from "../pages/contacto/contacto";
import {MainService} from "./main.service";
import {CheckInPage} from "../pages/check-in/check-in";
import {BuscarAmigosPage} from "../pages/buscar-amigos/buscar-amigos";
import {CalendarioPage} from "../pages/calendario/calendario";
import {Config} from "./config";
import {TranslateService} from "ng2-translate";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    //rootPage = LoginPage;
    rootPage: any;
    user: any;
    pages = [];

    prod = false;
    googleReverseClientId: any;
    googleAnalyticsTrackId: any;
    pushSenderID: any;
    lenguaje:any;

    menues: any = [
        {
            function: function () {
                this.openPage(PrincipalPage)
            }.bind(this),
            icono: 'home',
            nombre: 'inicio',
        },
        {
            function: function () {
                this.openPage(FavoritosPage)
            }.bind(this),
            icono: 'star',
            nombre: 'favoritos',
        },
        {
            function: this.recomiendanos,
            icono: 'notifications',
            nombre: 'recomiendanos',
        },

        {
            function: function () {
                this.openPage(CheckInPage)
            }.bind(this),
            icono: 'checkmark-circle-outline',
            nombre: 'Check In',
        },
        {
            function: function () {
                this.openPage(BuscarAmigosPage)
            }.bind(this),
            icono: 'people',
            nombre: 'buscarAmigos',
        },
        {
            function: function () {
                this.openPage(CalendarioPage)
            }.bind(this),
            icono: 'calendar',
            nombre: 'calendario',
        },
        {
            function: this.AppRate,
            icono: 'create',
            nombre: 'calificacionGP',
        },
        {
            function: function () {
                this.openPage(TuEmpresaAquiPage)
            }.bind(this),
            icono: 'open',
            nombre: 'registraEmpresa',
        },
        {
            function: function () {
                this.openPage(ContactoPage)
            }.bind(this),
            icono: 'mail',
            nombre: 'contactanos',
        },
    ];

    constructor(platform: Platform,
                public events: Events,
                public loadingCtrl: LoadingController,
                public mainService: MainService,
                public translate: TranslateService,
                _config: Config) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();


            if (navigator.language.indexOf('en') > -1){
                this.lenguaje = 'en';
            }else if (navigator.language.indexOf('es') > -1){
                this.lenguaje = 'es';
            }
            console.log(this.lenguaje, navigator.language.indexOf('es'));

            this.translate.setDefaultLang(this.lenguaje);
            this.translate.use(this.lenguaje);

            this.googleReverseClientId = _config.get('googleReverseClientId');
            this.googleAnalyticsTrackId = _config.get('googleAnalyticsTrackId');
            this.pushSenderID = _config.get('pushSenderID');

            if (this.prod) {

                GoogleAnalytics.startTrackerWithId(this.googleAnalyticsTrackId)
                    .then(() => {
                        console.log('Google analytics is ready now');
                        // Tracker is ready
                        // You can now track pages or set additional information such as AppVersion or UserId
                    })
                    .catch(e => console.log('Error starting GoogleAnalytics', e));

                console.log('Device UUID is: ' + Device.uuid);

                var push = Push.init({
                    android: {
                        senderID: this.pushSenderID
                    },
                    ios: {
                        alert: 'true',
                        badge: true,
                        sound: 'false'
                    }
                });

                push.on('registration', function (data) {
                    console.log('registrationId', data.registrationId);
                });

                // BackgroundGeolocation is highly configurable. See platform specific configuration options
                let config = {
                    url: 'http://192.168.0.113:3000/locations',
                    startOnBoot: true,
                    desiredAccuracy: 10,
                    stationaryRadius: 20,
                    distanceFilter: 30,
                    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
                    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
                };

                BackgroundGeolocation.configure((location) => {
                    console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

                    this.events.publish(this.mainService.event_location_detected, location);

                    if (platform.is('ios')) {
                        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                        // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                        BackgroundGeolocation.finish(); // FOR IOS ONLY
                    }

                }, (error) => {
                    console.log('BackgroundGeolocation error');
                }, config);

                // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
                BackgroundGeolocation.start();

                let loader = this.loadingCtrl.create({
                    content: "Ingresando a EvenProm",
                    // duration: 6000
                });
                loader.present();

                // NativeStorage user data
                mainService.getUser().then(
                    data => {
                        this.user = data;
                        this.mainService.setUser(data);
                    }
                );

                // Facebook login
                Facebook.getLoginStatus()
                    .then(rtaLoginStatus => {
                        console.log("rtaLoginStatus", JSON.stringify(rtaLoginStatus));
                        if (rtaLoginStatus.status == 'connected') {
                            this.rootPage = PrincipalPage;

                        } else {
                            this.rootPage = LoginPage;
                        }
                        loader.dismissAll();
                    })
                    .catch(error => {
                        console.error(error);
                        console.error('login', JSON.stringify(error));
                        loader.dismissAll();
                    });

                // Google login
                GooglePlus.trySilentLogin({
                    'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                    'webClientId': this.googleReverseClientId,
                    'offline': true
                })
                    .then(
                        rta => {
                            console.log("rta", JSON.stringify(rta));
                            this.rootPage = PrincipalPage;
                            loader.dismissAll();
                        }
                    )
                    .catch(error => {
                        console.error(error);
                        console.error('login google', JSON.stringify(error));
                    })
                ;

            } else {
                this.rootPage = PrincipalPage;
            }

        });

        this.listenToLoginEvents();
    }


    listenToLoginEvents() {
        this.events.subscribe('user:login', (user) => {
            console.log('login');
            this.user = (true);
        });

        this.events.subscribe('user:signup', (user) => {
            console.log('login');
            console.log('userdata', user);
            this.user = user;
        });

        this.events.subscribe('user:logout', () => {
            console.log('logout');
        });
    }


    nada() {
        console.log("menu");
    }

    AppRate() {
        AppRate.preferences.storeAppURL = {
            // ios: '<my_app_id>',
            android: 'market://details?id=com.evenprom.evenpromapp',
        };

        AppRate.promptForRating(false);
    }

    recomiendanos() {
        Market.open('com.evenprom.evenpromapp');
    }

    logout() {

        Facebook.logout().then(function (response) {
            NativeStorage.clear();
        }, function (error) {
            console.log(error);
        });

        GooglePlus.logout()
            .then(function (response) {
                NativeStorage.clear();
            }, function (error) {
                console.log(error);
            });

        BackgroundGeolocation.stop();
        this.rootPage = LoginPage;
        console.log('logout');
    }

    openPage(page) {
        this.rootPage = page;
    }

    cambiarLenguaje() {
        console.log(this.lenguaje);
        this.translate.use(this.lenguaje);

    }

}
