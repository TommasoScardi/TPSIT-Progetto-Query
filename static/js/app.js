const DEBUG = true;
const REQ_URL = "api/";
const DOM_IDS = {
    selLeft: "#selL",
    selRight: "#selR",
    spanVsNameL: "#motNameL",
    spanVsNameR: "#motNameR",
    challengeTabColumnId: "#column-",
    tripMotsContainer: "#tripMotsContainer",
    btnAddTripMot: "#btnAddTripMot",
    btnDeleteTripMot: "#tripBtn-",
    btnDeleteTripMots: ".btn-delete-trip",
    tripMotContainer: "#trip-mots-row-",
    inputTripName: "#nameTrip",
    selectTripMots: ".trip-mots",
    inputTripMotsKm: ".trip-mots-km",
    btnAddTrip: "#btnAddTrip",
    queryMot: "#queryMot",
    queryTrip: "#queryTrip"
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
const ALERT_COLOR = {
    red: "danger",
    yellow: "warning",
    green: "success",
    blue: "primary"
}

let bData = {
    listMots: null,
    challengeData: [],
    listTrips: null,
    motData: null,
    tripData: null,
    selNum: 0,
    motPrefix: "M",
    tripPrefix: "T"
};

$(async function () {
    await getMotNamesList(bData.motPrefix);
    await getTripNamesList(bData.tripPrefix);
    fillUiSelect([...bData.listMots, ...bData.listTrips]);
    fillTripMotSelect(bData.listMots);
    
    //Event binding
    //FIXME: new event handler function
    // $(DOM_IDS.selLeft).on("change", getMotsDetails);
    // $(DOM_IDS.selRight).on("change", getMotsDetails);
    $(DOM_IDS.selLeft).on("change", selectHandler);
    $(DOM_IDS.selRight).on("change", selectHandler);
    
    createTripMot();
    $(DOM_IDS.btnAddTripMot).on("click", createTripMot);

    $(DOM_IDS.btnAddTrip).on("click", addTrip);
});

async function getMotNamesList(prefix) {
    let options = { ...AJAX_DEF_OPT };
    options.url += "MOT-namesList";

    await $.ajax(options)
        .done(function (data, textStatus, jqXHR) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) {btAlert("Errore nel ricevere la risposta dal server", ALERT_COLOR.red); return;}
            if (DEBUG) console.log(jsonData);

            for (let index = 0; index < jsonData.length; index++) {
                jsonData[index].id = `${prefix}${jsonData[index].id}`;
            }
            
            bData.listMots = jsonData;
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            if (DEBUG) console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return;
            btAlert(errMsg.message, ALERT_COLOR.red);
        });
    $(DOM_IDS.queryMot).append(document.createTextNode("SELECT id, name from queryProject.mot;\n"));
    Prism.highlightAll();
}

async function getTripNamesList(prefix) {
    let options = { ...AJAX_DEF_OPT };
    options.async = false;
    options.url += `Trip-namesList`;

    await $.ajax(options)
        .done(function (data, textStatus, jqXHR) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) {
                btAlert("Errore nel ricevere la risposta dal server", ALERT_COLOR.red);
                return;
            }
            if (DEBUG) console.log(jsonData);

            for (let index = 0; index < jsonData.length; index++) {
                jsonData[index].id = `${prefix}${jsonData[index].id}`;
            }
            bData.listTrips = jsonData;
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            if (DEBUG) console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return;
            btAlert(errMsg.message, ALERT_COLOR.red);
        });
    $(DOM_IDS.queryMot).append(document.createTextNode("SELECT id, name from queryProject.trip;\n"));
    Prism.highlightAll();
}

async function getMotData(motId) {
    let options = { ...AJAX_DEF_OPT };
    options.url = AJAX_DEF_OPT.url + "MOT-mot&id=" + motId;

    await $.ajax(options)
        .done(function (data, textStatus, jqXHR) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) {btAlert("Errore nel ricevere la risposta dal server", ALERT_COLOR.red); return;}
            if (DEBUG) console.log(jsonData);

            bData.motData = jsonData;
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            if (DEBUG) console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return;
            btAlert(errMsg.message, ALERT_COLOR.red);
            return;
        });
}

async function getTripData(tripId) {
    let options = { ...AJAX_DEF_OPT };
    options.url = AJAX_DEF_OPT.url + "Trip-trip&id=" + tripId;

    await $.ajax(options)
        .done(function (data, textStatus, jqXHR) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) {btAlert("Errore nel ricevere la risposta dal server", ALERT_COLOR.red); return;}
            if (DEBUG) console.log(jsonData);

            bData.tripData = jsonData;
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            if (DEBUG) console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return;
            btAlert(errMsg.message, ALERT_COLOR.red);
            return;
        });
}

function parseSelValIntoId(selVal) {
    //example: T1, M3 ....
    if(selVal.length < 2) return false;
    let id = parseInt(selVal.slice(1, selVal.length));
    if (isNaN(id)) return false;
    return {
        id: id,
        type: selVal.charAt(0) == 'M' ? "MOT" : selVal.charAt(0) == "T" ? "TRIP" : null
    };
}

//FIXME: ora non funziona piu perchè la lista include anche i trips che sono alfanumerici
async function selectHandler(e) {
    disableOptionSelected(e);
    if (DEBUG) console.log(e);

    if ($(e.target).val() == undefined || $(e.target).val() == "") return;

    let elemDispatcherId = "#"+$(e.target).attr("id");
    let selData = parseSelValIntoId($(e.target).val());
    if (!selData) { btAlert("C'è stato un errore con gli idla finestra di selezione mezzi", ALERT_COLOR.red); return;}
    let dbData = null;
    switch (selData.type) {
        case "MOT":
            await getMotData(selData.id);
            dbData = bData.motData;
            break;

        case "TRIP":
            await getTripData(selData.id);
            dbData = bData.tripData;
            if (!Array.isArray(dbData)) {
                btAlert("Errore, dati trip in formato non valido", ALERT_COLOR.red);
                break;
            }
            dbData = [];
            dbTripData.forEach(async (element) => {
                await getMotData(element.motId)
                dbData.push({...bData.tripData, km:element.kmTrav});
            });
            
            break;
    
        default:
            btAlert("Errore, selezionare due mezzi di trasporto o viaggi validi", ALERT_COLOR.red);
            return;
    }
    if (dbData == null) {
        btAlert("Errore, selezionare due mezzi di trasporto o viaggi validi", ALERT_COLOR.red);
        return;
    }
    switch (elemDispatcherId) {
        case DOM_IDS.selLeft:
            bData.challengeData = [];
            bData.challengeData.push(dbData);
            break;

        case DOM_IDS.selRight:
            if (bData.challengeData.length == 2) bData.challengeData.pop();
            bData.challengeData.push(dbData);
            break;
    
        default:
            btAlert("C'è stato un errore con la finestra di selezione mezzi", ALERT_COLOR.red);
            return;
    }

    //selezionati due elementi
    if (bData.challengeData.length == 2) {
        writeCompareMotsData(bData.challengeData);
    }
}

//FIXME: passare alla funzione writeCompareMotsData il container DOM dove inserire i dati del mot o del trip
//TODO: create un template di tabella VS (destra e sinistra [si, le cose cambiano])
function writeCompareMotsData(dataComparison) {
    //index == 0 ==> prima colonna selezionata, sta sulla sinistra(left)
    //dataComparison.length ==> 2: due colonne da processare
    $(`${DOM_IDS.challengeTabColumnId}${0}`).empty();
    $(`${DOM_IDS.challengeTabColumnId}${1}`).empty();

    for (let index = 0; index < dataComparison.length; index++) {
        if (Array.isArray(dataComparison[index])) {
            for (const iterator of dataComparison[index]) {
                $(`${DOM_IDS.challengeTabColumnId}${index}`).append($(assembleDomForMot(iterator, index == 0)));
            }
        }
        else {
            $(`${DOM_IDS.challengeTabColumnId}${index}`).append($(assembleDomForMot(dataComparison[index], index == 0)));
        }
    }
    $(DOM_IDS.spanVsNameL).text($(`${DOM_IDS.selLeft} > [value=${$(DOM_IDS.selLeft).val()}]`).text());
    $(DOM_IDS.spanVsNameR).text($(`${DOM_IDS.selRight} > [value=${$(DOM_IDS.selRight).val()}]`).text());
}

function assembleDomForMot(data, left = true) {
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

    let htmlElem = $("<div>", { class: "row" });
    let htmlUl = $("<ul>")

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            if (element == null) continue;
            if (key == "imgUrl") {
                let imgCont = $("<div>", {
                    class: `col-6 order-${left - 1 ? "0" : "1"}`
                });

                imgCont.append(
                    $("<img>",{
                        class: "img-fluid rounded-2",
                        src: element,
                        alt: "immaginen <"
                    })
                );
                htmlElem.append(imgCont);
                continue;
            }

            let textItem = "";
            if (key == "fuel" || key == "fuelConsumptionUnit") {
                textItem = `${motSpecNames[key]["name"]} : ${motSpecNames[key]["types"][element]}`;
            }
            else {
                textItem = `${motSpecNames[key]} : ${element}`;
            }
            htmlUl.append(
                $("<li>", {
                    text: textItem
                })
            );
        }
    }

    htmlElem.append(
        $("<div>", {
            class: `col-6 order-${left - 1 ? "1" : "0"}`
        }).append(htmlUl)
    );

    return htmlElem;
}

//FIXME: vecchia funzine da cancellare
function getMotsDetails(e) {
    disableOptionSelected(e);

    const motIds = [
        parseInt($(DOM_IDS.selLeft).val()),
        parseInt($(DOM_IDS.selRight).val())
    ];

    if (isNaN(motIds[0]) || isNaN(motIds[1])) {
        btAlert("Select two means of trasportation to start!", ALERT_COLOR.yellow);
        return;
    }
    if (motIds[0] == motIds[1]) {
        btAlert("Error, you can't compare two identical means of trasportation!", ALERT_COLOR.red);
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
                if (jsonData == undefined) {btAlert("Errore nel ricevere la risposta dal server", ALERT_COLOR.red); return;}
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
                btAlert(errMsg.message, ALERT_COLOR.red);
                return;
            });
    }
}

function fillUiSelect(data) {
    $(DOM_IDS.selLeft).empty().append($('<option>', {
        text: "",
        selected: true
    }));
    $(DOM_IDS.selRight).empty().append($('<option>', {
        text: "",
        selected: true
    }));
    if (data == undefined || data == null) return;
    data.forEach((value) => {
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
        queryString = DOM_IDS.selectTripMots;
    }
    else {
        queryString = `[selnum=${selNum}] > ${DOM_IDS.selectTripMots}`
    }

    $(queryString).empty().append($('<option>', {
        text: "Scegli...",
        selected: true
    }));
    if (dataSelect == undefined || dataSelect == null) return;
    dataSelect.forEach((value) => {
        $(queryString).append(
            $("<option>", {
                value: value.id,
                text: value.name,
            })
        );
    });
}

function disableOptionSelected(e) {
    let selId = ("#" + e.target.id) == DOM_IDS.selLeft ? DOM_IDS.selRight : DOM_IDS.selLeft;
    let selVal = e.target.value;

    $(`${selId} > *`).attr("disabled", false);
    $(`${selId} > [value="${selVal}"]`).attr("disabled", true);
}



function createTripMot() {
    const selTripMotTemplate = `<div class="row row-cols-auto align-items-end" id="trip-mots-row-${bData.selNum}">
                                    <div class="col-md-7 col-sm-12" selnum="${bData.selNum}">
                                        <label class="form-label" for="motUsed">Mezzo</label>
                                        <select class="form-select trip-mots">
                                        </select>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <label for="kmTraveled" class="form-label">KM</label>
                                        <input type="number" min="1" class="form-control trip-mots-km" value="1">
                                    </div>
                                    <div class="col-md-2 col-sm-6 top-0">
                                        <button type="button" class="btn btn-danger btn-delete-trip" id="tripBtn-${bData.selNum}" value="${bData.selNum}">X</button>
                                    </div>
                                </div>`;
    $(DOM_IDS.tripMotsContainer).append(selTripMotTemplate);
    $(DOM_IDS.btnDeleteTripMot + bData.selNum).on("click", deleteTripMot);
    fillTripMotSelect(bData.listMots, bData.selNum);
    bData.selNum++;
}

function deleteTripMot(e) {
    if(DEBUG) console.log(e);
    $(e.target).off();
    $(DOM_IDS.tripMotContainer + e.target.value).remove();
}

function resetTripTab() {
    $(DOM_IDS.inputTripName).val("");
    $(DOM_IDS.btnDeleteTripMots).each(function(i, elem) {
        $(elem).trigger("click");
    });
    bData.selNum = 0;
    createTripMot();
}

function addTrip() {
    let error = {
        state: false,
        message: []
    };
    let trip = {
        name: $(DOM_IDS.inputTripName).val(),
        mots: []
    };
    $(DOM_IDS.selectTripMots).each(function (i, el) {
        let idVal = parseInt(el.value);
        if (!isNaN(idVal)) {
            let kmVal = parseInt($(DOM_IDS.inputTripMotsKm).eq(i).val());
            if (!isNaN(kmVal) && kmVal > 0) {
                let id_km = [idVal, kmVal];
                trip.mots.push(id_km);
            }
            else {
                error.state = true;
                error.message.push("Insert a valid KM number");
            }
        }
        else {
            error.state = true;
            error.message.push("Select a mot from the trip window");
        }
    });
    if(error.state) {
        error.message.forEach(function(value) {
            btAlert(value, ALERT_COLOR.red);
        });
        return;
    }
    if(DEBUG) console.log(trip);

    let options = { ...AJAX_DEF_OPT };
    options.method = "POST";
    options.contentType = "application/json";
    options.url += "Trip-create";
    options.data = JSON.stringify(trip);
    console.log(options );

    $.ajax(options)
        .done(function (data, textStatus, jqXHR) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) {btAlert("Errore nel ricevere la risposta dal server", ALERT_COLOR.red); return;}
            if (DEBUG) console.log(jsonData);

            resetTripTab();
            btAlert(jsonData.message, ALERT_COLOR.green);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            if (DEBUG) console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return;
            btAlert(errMsg.message, ALERT_COLOR.red);
        });
}

//TODO: manca l'AJAX in POST richiamato dal pulsande aggiungi viaggio
//TODO: riempire tutti i riquadri per le query e animarli in base ai controlli che cambiano