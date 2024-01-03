const API_PATH = `http://localhost:8080/api`

const santaka = [54.89984180616253, 23.961551736420333];

var map = L.map('map', {editable: true}).setView(santaka, 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
}).addTo(map);


L.EditControl = L.Control.extend({

    options: {
        position: 'topleft',
        callback: null,
        kind: '',
        html: ''
    },

    onAdd: function (map) {
        let container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
            link = L.DomUtil.create('a', '', container);

        link.href = '#';
        link.title = 'Create a new ' + this.options.kind;
        link.innerHTML = this.options.html;
        L.DomEvent.on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', function () {
                window.LAYER = this.options.callback.call(map.editTools);
                remove_focus();
            }, this);

        return container;
    }

});

