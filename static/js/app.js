const DEBUG = true;
const REQ_URL = "http://localhost/Scardi_Tommaso_Query/api/";
const DOM_IDS = {
    selLeft: "#selL",
    selRight: "#selR",
    tripMots: ".trip-mots",
    tripMotsKm: ".trip-mots-km",
    listDataMotL: "#listDataMotL",
    imgMotL: "#imgMotL",
    listDataMotR: "#listDataMotR",
    imgMotR: "#imgMotR",
    tripMotsContainer: "#tripMotsContainer",
    btnAddTripMot: "#btnAddTripMot",
};
const AJAX_DEF_OPT = {
    async: true,
    crossDomain: true,
    //headers: { Accept: "application/json" },
    url: `${REQ_URL}?q=get`,
    method: "GET",
    processData: false,
    //contentType: "application/json",
    //data: null,
};

let bData = {
    listMots: null,
    mots:[],
    listTrips: null,
    trips: [],
    selNum: 1
};

$(function () {
    getMotNamesList();

    //Event binding
    $(DOM_IDS.selLeft).on("change", getMotsDetails);
    $(DOM_IDS.selRight).on("change", getMotsDetails);

    $(DOM_IDS.btnAddTripMot).on("click", createTripMot);
});

function getMotNamesList() {
    let options = { ...AJAX_DEF_OPT };
    options.url += "MOT-namesList";

    $.ajax(options)
        .done(function (data, textStatus, jqXHR) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) return;
            if (DEBUG) console.log(jsonData);
            
            bData.listMots = jsonData;
            fillUiSelect(jsonData);
            fillTripMotSelect(jsonData);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            if (DEBUG) console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return;
            btAlert(errMsg.message, "danger");
        });
}

function fillUiSelect(dataSelect) {
    $(DOM_IDS.selLeft).empty().append($('<option>', {
        text: "",
        selected: true
    }));
    $(DOM_IDS.selRight).empty().append($('<option>', {
        text: "",
        selected: true
    }));
    if (dataSelect === undefined) return;
    dataSelect.forEach((value) => {
        $(DOM_IDS.selLeft).append(
            $("<option>", {
                value: value.id,
                text: value.name,
            })
        );
        $(DOM_IDS.selRight).append(
            $("<option>", {
                value: value.id,
                text: value.name,
            })
        );
    });
}

function fillTripMotSelect(dataSelect, selNum = NaN) {
    if (selNum == undefined) return;
    let queryString = "";
    if (isNaN(selNum)) {
        queryString = DOM_IDS.tripMots;
    }
    else {
        queryString = `[selnum=${selNum}] > ${DOM_IDS.tripMots}`
    }

    $(queryString).empty().append($('<option>', {
        text: "Scegli...",
        selected: true
    }));
    if (dataSelect === undefined) return;
    dataSelect.forEach((value) => {
        $(queryString).append(
            $("<option>", {
                value: value.id,
                text: value.name,
            })
        );
    });
}

function getMotsDetails(e) {
    selectLR(e);

    const motIds = [
        parseInt($(DOM_IDS.selLeft).val()),
        parseInt($(DOM_IDS.selRight).val())
    ];

    if (isNaN(motIds[0]) || isNaN(motIds[1])) {
        btAlert("Select two means of trasportation to start!", "warning");
        return;
    }
    if (motIds[0] == motIds[1]) {
        btAlert("Error, you can't compare two identical means of trasportation!", "danger");
        return;
    }

    $(DOM_IDS.listDataMotL).empty();
    $(DOM_IDS.listDataMotR).empty();
    bData.mots = [];

    for (let index = 0; index < motIds.length; index++) {
        let options = { ...AJAX_DEF_OPT };
        options.url = AJAX_DEF_OPT.url + "MOT-mot&id=" + motIds[index];

        $.ajax(options)
            .done(function (data, textStatus, jqXHR) {
                let jsonData = JSON.parse(data);
                if (jsonData == undefined) return;
                if (DEBUG) console.log(jsonData);

                bData.mots.push(jsonData);
                jsonData.first = index == 0
                //FIXME: non scalabile, nel caso di tre colonne verifico 3 indici ??
                writeCompareMotsData(jsonData);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (DEBUG) console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
                let errMsg = JSON.parse(jqXHR.responseText);
                if (errMsg == undefined) return;
                btAlert(errMsg.message, "danger");
                return;
            });
    }
}

function selectLR(e) {
    let selId = ("#" + e.target.id) == DOM_IDS.selLeft ? DOM_IDS.selRight : DOM_IDS.selLeft;
    let selVal = e.target.value;

    $(`${selId} > *`).attr("disabled", false);
    $(`${selId} > [value="${selVal}"]`).attr("disabled", true);
}

function writeCompareMotsData(dataComparison) {
    const motSpecNames = {
        name: "Nome",
        gCO2PerKm: "Grammi di CO2 per KM",
        taxes: "Tasse [€]",
        fuel: {
            name: "Carburante",
            types: {
                E: "Elettrico",
                B: "Benzina",
                D: "Diesel",
                G: "Gas",
                M: "Metano"
            }
        },
        fuelConsumptionUnit: {
            name: "Unità di consumo del carburante",
            types: {
                LT: "Litro",
                MC: "Metro Cubo",
                KW: "Kilowatt"
            }
        },
        kilometerPerUnit: "Km percorsi per unità di consumo del carburante",
        subscription: "Abbonamento [€]",
        ticket: "Biglietto [€]"
    };

    for (const key in dataComparison) {
        if (Object.hasOwnProperty.call(dataComparison, key)) {
            const element = dataComparison[key];
            if (element == null) continue;
            if (key == "imgUrl") {
                $(dataComparison.first ? DOM_IDS.imgMotL : DOM_IDS.imgMotR).attr("src", element);
                continue;
            }
            if (key == "first") continue;

            let textItem = "";
            if (key == "fuel" || key == "fuelConsumptionUnit") {
                textItem = `${motSpecNames[key]["name"]} : ${motSpecNames[key]["types"][element]}`;
            }
            else {
                textItem = `${motSpecNames[key]} : ${element}`;
            }
            $(dataComparison.first ? DOM_IDS.listDataMotL : DOM_IDS.listDataMotR).append($('<li>', {
                text: textItem
            }));
        }
    };
}

function createTripMot() {
    const selTripMotTemplate = `<div class="row row-cols-auto align-items-end">
                                    <div class="col-md-7 col-sm-12" selnum="${bData.selNum}">
                                        <label class="form-label" for="motUsed">Mezzo</label>
                                        <select class="form-select trip-mots">
                                        </select>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <label for="kmTraveled" class="form-label">KM</label>
                                        <input type="number" min="1" class="form-control trip-mots-km">
                                    </div>
                                    <div class="col-md-2 col-sm-6 top-0">
                                        <button type="button" class="btn btn-danger">X</button>
                                    </div>
                                </div>`;
    $(DOM_IDS.tripMotsContainer).append(selTripMotTemplate);
    //TODO: creare l'evento di cancellazione di un mezzo, quindi quando eliminato sganciare con $().off() ogni event listener dal pulsante X

    fillTripMotSelect(bData.listMots, bData.selNum);
    bData.selNum++;
}

//TODO: manca l'AJAX in POST richiamato dal pulsande aggiungi viaggio
//TODO: riempire tutti i riquadri per le query e animarli in base ai controlli che cambiano