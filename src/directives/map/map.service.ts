import {Injectable} from '@angular/core';
//import {Map, TileLayer} from 'leaflet';

let L = require('leaflet');

import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class MapService {
    public map;
    public baseMaps:any;

    //Observable bounds source
    private _geosearchBoundsSource = new ReplaySubject<any>();
    geosearchBounds$ = this._geosearchBoundsSource.asObservable();

    constructor() {
        this.baseMaps = {
            OpenStreetMap: new L.TileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
            })
        };
    }

    // load a web map and return response
    createMap(domId:any) {
        this.remove()
        this.map = new L.Map(domId, {
            zoomControl: false,
            //center: new L.LatLng(40.731253, -73.996139),
            //zoom: this.getURLParameter('zoomLevel') || 12,
            zoom: 16,
            minZoom: 4,
            maxZoom: 18,
            layers: [this.baseMaps.OpenStreetMap]
        });
        L.control.zoom({position: 'topright'}).addTo(this.map);
        // L.control.layers(this.baseMaps).addTo(this.map);
        return this.map;
    };

    // getURLParameter(name) {
    //     return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    // }

    // service command
    changeBounds(newBounds:any) {
        this._geosearchBoundsSource.next(newBounds);
    }

    addMarker(newBounds:any, text) {

        let maker = L.marker(newBounds).addTo(this.map);

        console.log(maker);

        if (text) {
            maker.bindPopup(text);
        }
    }

    setPosition(lat, lng) {
        var newLatLng = new L.LatLng(lat, lng);

        this.map.panTo(newLatLng);

    }

    setBound(sLat, sLng, nLat, nLng) {
        var southWest = L.latLng(sLat, sLng),
            northEast = L.latLng(nLat, nLng),
            bounds = L.latLngBounds(southWest, northEast);

        this.changeBounds(bounds);

    }

    remove() {
        if(this.map != undefined || this.map != null) {
            this.map.remove();
        }

    }

    disableMouseEvent(tag:string) {
        var html = L.DomUtil.get(tag);

        L.DomEvent.disableClickPropagation(html);
        L.DomEvent.on(html, 'mousewheel', L.DomEvent.stopPropagation);

    };
}