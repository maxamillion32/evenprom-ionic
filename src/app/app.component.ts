import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

// import { TabsPage } from '../pages/tabs/tabs';
import {PrincipalPage} from "../pages/principal/principal";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage = PrincipalPage;

    pages = [];

    menues: any = [
        {
            function: 'nada()',
            icono: 'notifications',
            nombre: 'Notificaciones',
        },
        {
            function: 'nada()',
            icono: 'search',
            nombre: 'BUSCALO SEGÚN TU ESTILO/ONDA!',
        },
        {
            function: 'nada()',
            icono: 'flame',
            nombre: 'TUS LUGARES EN VIVO',
        },
        {
            function: 'nada()',
            icono: 'funnel',
            nombre: 'FILTROS',
        },
        {
            function: 'nada()',
            icono: 'contact',
            nombre: 'PERFIL  (FOTOS, AVALIAR/PUNTUACION, GRUPOS, GUARDADOS)',
        },
        {
            function: 'nada()',
            icono: 'share',
            nombre: 'INVITA AMIGOS A APP',
        },
        {
            function: 'nada()',
            icono: 'ribbon',
            nombre: 'BECOME A PREMIUM USER',
        },
        {
            function: 'nada()',
            icono: 'contacts',
            nombre: 'BUSCA AMIGOS',
        },
        {
            function: 'nada()',
            icono: 'share',
            nombre: 'INVITA AMIGOS A APP',
        },
        {
            function: 'nada()',
            icono: 'heart',
            nombre: 'MIS FAVORITOS',
        },
        {
            function: 'nada()',
            icono: 'star',
            nombre: 'CALIFICANOS EN GOOGLE PLAY',
        },
        {
            function: 'nada()',
            icono: 'calendar',
            nombre: 'CALENDARIO',
        },
        {
            function: 'nada()',
            icono: 'search',
            nombre: 'SEARCH',
        },
        {
            function: 'nada()',
            icono: 'locate',
            nombre: 'GEOLOCALIZACION-DISTANCIA',
        },
        {
            function: 'nada()',
            icono: 'call',
            nombre: 'CONTACTANOS',
        },
        {
            function: 'nada()',
            icono: 'card',
            nombre: 'BUY NOW! AGARRALO AHORA',
        },
        {
            function: 'nada()',
            icono: 'pricetag',
            nombre: 'MY TICKETS',
        },
    ];

    constructor(platform: Platform) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }

    nada() {
        console.log('menu');
    }
}