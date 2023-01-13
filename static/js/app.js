const DEBUG = {
    gen: false,
    ajax: false
}
const REQ_URL = "api/";
const HTML_ELEM = {
    selectLeftEl: "#selL",
    selectRigthEl: "#selR",
    columnLeft: "#colL",
    selL: "#colL",
    columnRigth: "#colR",
    selR: "#colR",
    tripMotsContainer: "#tripMotsContainer",
    btnDeleteTripMot: "#tripBtn-",
    btnAddTripMot: "#btnAddTripMot",
    btnAddTrip: "#btnAddTrip",
    selectTripMots: ".trip-mots",
    inputTripName: "#nameTrip",
    btnDeleteTripMots: ".btn-delete-trip",
    inputTripMotsKm: ".trip-mots-km",
    tripMotContainer: "#trip-mots-row-",
    queryMot: "#queryMot",
    queryTrip: "#queryTrip",
};

const PREFIXS = {
    mot: "M",
    trip: "T",
}

const AJAX_OPT = {
    async: true,
    crossDomain: true,
    //headers: { Accept: "application/json" },
    url: `${REQ_URL}?q=get`,
    method: "GET",
    processData: false,
    //contentType: "application/json",
    //data: null,
};

const ALERT_COL = {
    red: "danger",
    yel: "warning",
    gre: "success",
}

const QUERIES = {
    selectBox: "SELECT id, name from queryProject.mot\nSELECT id, name from queryProject.trip",
    vsMot: "SELECT name, img_url, g_co2_km, taxes, fuel, fuel_consumption_unit, kilometer_per_unit, subscription, ticket\n\tFROM queryProject.mot m\n\tJOIN queryProject.emissions e ON m.id = e.id_mot\n\tJOIN queryProject.costs c ON m.id = c.id_mot\n\tWHERE m.id = ",
    vsTripName: "SELECT name from queryProject.trip where id = ",
    vsTripData: `SELECT id_mot, km_traveled\n\tFROM queryProject.trip t, queryProject.trip_mot tm\n\tWHERE t.id = tm.id_trip AND t.id = `,
    addTripName: `INSERT INTO queryProject.trip (name) VALUES `,
    addTripData: `INSERT INTO queryProject.trip_mot VALUES `
}

let selectedItemsIds = {
    selL: null,
    selR: null,
};

let listMot_Trips = null;
let tripMotsFieldCount = 0;

//document onload function
//bind dom with event handler
$(function (e) {
    FillSelectEventHandler(e);

    [$(HTML_ELEM.selectLeftEl), $(HTML_ELEM.selectRigthEl)]
        .forEach(function (val) {
            val.on("change", SelectEventHandler);
        });

    $(HTML_ELEM.btnAddTripMot).on("click", CreateTripMotEventHandler);
    $(HTML_ELEM.btnAddTrip).on("click", AddTripEventHandler);

});

function WriteQuery(query, id, append = false) {
    $(id).text(append ? `${$(id).text()}${$(id).text().length > 0 ? "\n" : ""}${query}` : query);
    Prism.highlightAll();
}

async function GetListMot_Trip() {
    let res = null;
    let reqOpt = { ...AJAX_OPT };
    reqOpt.url += "MOT-namesList";

    //TODO: add some tyi-catch blocks
    await $.ajax(reqOpt)
        .done(function (data) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) return null;
            if (DEBUG.ajax) console.log(jsonData);
            jsonData.forEach(function (val, i, array) {
                array[i].id = PREFIXS.mot + val.id;
            })
            res = jsonData;
        })
        .fail(function (jqXHR) {
            if (DEBUG.ajax) console.log(jqXHR.responseText);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return null;
            res = { error: true, ...errMsg };
        });

    //codice errore
    if (res.error) {
        return res;
    }

    reqOpt.url = AJAX_OPT.url + "Trip-namesList";
    //TODO: add some tyi-catch blocks
    await $.ajax(reqOpt)
        .done(function (data) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) return null;
            if (DEBUG.ajax) console.log(jsonData);
            jsonData.forEach(function (val, i, array) {
                array[i].id = PREFIXS.trip + val.id;
            })
            res = res.concat(jsonData);
        })
        .fail(function (jqXHR) {
            if (DEBUG.ajax) console.log(jqXHR.responseText);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return null;
            res = { error: true, ...errMsg };
        });
    if (DEBUG.gen) console.log(res);
    return res;
}

async function GetMotData(id) {
    if (id == undefined || isNaN(parseInt(id))) return null;
    let res = null;
    let reqOpt = { ...AJAX_OPT };
    reqOpt.url += "MOT-mot&id=" + id;

    //TODO: add some tyi-catch blocks
    await $.ajax(reqOpt)
        .done(function (data) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) return null;
            if (DEBUG.ajax) console.log(jsonData);
            res = jsonData;
        })
        .fail(function (jqXHR) {
            if (DEBUG.ajax) console.log(jqXHR.responseText);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return null;
            res = { error: true, ...errMsg };
        });
    if (DEBUG.gen) console.log(res);
    return res;
}

async function GetTripData(id) {
    if (id == undefined || isNaN(parseInt(id))) return null;
    let res = null;
    let reqOpt = { ...AJAX_OPT };
    reqOpt.url += "Trip-trip&id=" + id;

    //TODO: add some tyi-catch blocks
    await $.ajax(reqOpt)
        .done(function (data) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) return null;
            if (DEBUG.ajax) console.log(jsonData);
            res = jsonData;
        })
        .fail(function (jqXHR) {
            if (DEBUG.ajax) console.log(jqXHR.responseText);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return null;
            res = { error: true, ...errMsg };
        });
    if (res == null || res.error) {
        return res;
    }

    for (let index = 0; index < res.mots.length; index++) {
        const element = res.mots[index];
        let tempFetchMot = await GetMotData(element.motId);
        res.mots[index] = { ...res.mots[index], ...tempFetchMot };
    }

    if (DEBUG.gen) console.log(res);
    return res;
}

function CreateSelOptions(data) {
    let selectHtmlControllers = [$(HTML_ELEM.selectLeftEl), $(HTML_ELEM.selectRigthEl)];
    selectHtmlControllers.forEach(function (value) {
        value.empty();
        $('<option>', {
            text: "",
            selected: true
        }).appendTo(value);
    });
    if (data == undefined || data == null) return;
    data.forEach(function (value) {
        $("<option>", {
            value: value.id,
            text: value.name,
        }).appendTo(selectHtmlControllers);
    });
}

function CreateComparisonColumn(data) {
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
        ticket: "Biglietto [€]",
        kmTrav: "KM percorsi",
    };

    // let data = {
    //     type: element.charAt(0),
    //     id: parseInt(element.slice(1, element.length)),
    //     pos: key,
    //     data: {mots:[]},
    // };

    let rootElements = [];
    for (let index = 0; index < data.data.mots.length; index++) {
        const mot = data.data.mots[index];

        let rootElem = $("<div>", {
            class: "row g-3 mb-3",
        });
        let imgCont = $("<div>", {
            class: `col-md-6 col-sm-12 order-md-${data.pos == "selL" ? 1:0} order-sm-0`
        });
        let ulCont = $("<div>", {
            class: `col-md-6 col-sm-12 order-md-${data.pos == "selL" ? 0:1} order-sm-1`
        });
        let liCont = $("<ul>", {
            class: "list-group"
        });

        for (const key in mot) {
            if (Object.hasOwnProperty.call(mot, key)) {
                const element = mot[key];
                if (element == null || key == "motId") continue;
                if (key == "imgUrl") {
                    $("<img>", {
                        class: "img-fluid rounded-2",
                        src: element,
                        alt: "mot image"
                    }).appendTo(imgCont);
                    continue;
                }

                let textItem = "";
                if (key == "fuel" || key == "fuelConsumptionUnit") {
                    textItem = `${motSpecNames[key]["name"]} : ${motSpecNames[key]["types"][element]}`;
                }
                else {
                    textItem = `${motSpecNames[key]} : ${element}`;
                }
                $("<li>", {
                    text: textItem,
                    class: "list-group-item",
                }).appendTo(liCont)
            }
        }
        liCont.appendTo(ulCont)
        imgCont.appendTo(rootElem);
        ulCont.appendTo(rootElem);
        rootElements.push(rootElem);
        if (index < data.data.mots.length - 1) {
            rootElements.push($("<hr>", {
                class: "w-50 text-light m-auto mb-3",
            }));
        }
    }
    return rootElements;
}

function FillTripMotSelect(dataSelect, selNum = NaN) {
    if (selNum == undefined) return;
    let queryString = "";
    if (isNaN(selNum)) {
        queryString = HTML_ELEM.selectTripMots;
    }
    else {
        queryString = `[selnum=${selNum}] > ${HTML_ELEM.selectTripMots}`
    }

    $(queryString).empty().append($('<option>', {
        text: "Scegli...",
        selected: true
    }));
    if (dataSelect == undefined || dataSelect == null) return;
    dataSelect.forEach((value) => {
        if (value.id.charAt(0) == "T") return;
        $(queryString).append(
            $("<option>", {
                value: value.id.slice(1, value.id.length),
                text: value.name,
            })
        );
    });
}

async function FillSelectEventHandler(e) {
    let motTripDatas = await GetListMot_Trip();
    if (motTripDatas == null) {
        btAlert("Errore, imporribile ottenere i dati dal server", ALERT_COL.red);
        return;
    }
    if (motTripDatas.error) {
        btAlert(motTripDatas.message, ALERT_COL.red);
        return;
    }

    CreateSelOptions(motTripDatas);
    listMot_Trips = motTripDatas;
    WriteQuery(QUERIES.selectBox, HTML_ELEM.queryMot);
}

async function SelectEventHandler(e) {
    let selectedValue = $(e.target).val();

    let oppositeElem = `#${$(e.target).attr("id")}` == HTML_ELEM.selectLeftEl ? HTML_ELEM.selectRigthEl : HTML_ELEM.selectLeftEl;
    $(`${oppositeElem} > *`).attr("disabled", false);
    WriteQuery("", HTML_ELEM.queryMot);

    for (const key in selectedItemsIds) {
        if (Object.hasOwnProperty.call(selectedItemsIds, key)) {
            $(HTML_ELEM[key]).empty()
        }
    }

    if (selectedValue != undefined && selectedValue != "") {
        $(`${oppositeElem} > [value=${$(e.target).val()}]`).attr("disabled", true);

        selectedItemsIds[$(e.target).attr("id")] = selectedValue;
    }
    else {
        selectedItemsIds[$(e.target).attr("id")] = null;
        return;
    }

    if (selectedItemsIds.selL != null && selectedItemsIds.selL != "" && selectedItemsIds.selR != null && selectedItemsIds.selR != "") {
        for (const key in selectedItemsIds) {
            if (Object.hasOwnProperty.call(selectedItemsIds, key)) {
                const element = selectedItemsIds[key];
                if (isNaN(parseInt(element.slice(1, element.length)))) {
                    btAlert("Il mezzo o viaggio selezionato ha un identificativo errato", ALERT_COL.red);
                    return;
                }
                let elemData = {
                    type: element.charAt(0),
                    //Remove letter M or L
                    id: parseInt(element.slice(1, element.length)),
                    pos: key,
                    data: null,
                };
                if (elemData.type == PREFIXS.mot) {
                    let apiVal = await GetMotData(elemData.id);
                    if(apiVal != null && !apiVal.error) {
                        elemData.data = {mots: [apiVal]};
                        WriteQuery(`${key == "selL" ? "--select di sinistra" : "--select di destra"}\n${QUERIES.vsMot}${elemData.id}`, HTML_ELEM.queryMot, true);
                    }
                    else {
                        btAlert("Id mot errato: "+elemData,id, ALERT_COL.red);
                        return;
                    }
                }
                else if (elemData.type == PREFIXS.trip) {
                    let apiVal = await GetTripData(elemData.id);
                    if (apiVal != null && !apiVal.error) {
                        elemData.data = apiVal;
                        WriteQuery(`${key == "selL" ? "--select di sinistra" : "--select di destra"}\n${QUERIES.vsTripName}${elemData.id}\n${QUERIES.vsTripData}${elemData.id}`, HTML_ELEM.queryMot, true);
                    }
                    else {
                        btAlert("Id trip errato: " + elemData, id, ALERT_COL.red);
                        return;
                    }
                }
                else {
                    btAlert("Tipo del mezzo/viaggio inaspettato", ALERT_COL.red);
                    return;
                }

                console.log(elemData);
                $(HTML_ELEM[key]).append(CreateComparisonColumn(elemData));
            }
        }
    }
}

function CreateTripMotEventHandler() {
    const selTripMotTemplate = `<div class="row row-cols-auto align-items-end" id="trip-mots-row-${tripMotsFieldCount}">
                                    <div class="col-md-7 col-sm-12" selnum="${tripMotsFieldCount}">
                                        <label class="form-label" for="motUsed">Mezzo</label>
                                        <select class="form-select trip-mots" reqired>
                                        </select>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <label for="kmTraveled" class="form-label">KM</label>
                                        <input type="number" min="1" class="form-control trip-mots-km" value="1">
                                    </div>
                                    <div class="col-md-2 col-sm-6 top-0">
                                        <button type="button" class="btn btn-danger btn-delete-trip" id="tripBtn-${tripMotsFieldCount}" value="${tripMotsFieldCount}">X</button>
                                    </div>
                                </div>`;
    $(HTML_ELEM.tripMotsContainer).append(selTripMotTemplate);
    $(HTML_ELEM.btnDeleteTripMot + tripMotsFieldCount).on("click", DeleteTripMotEventHandler);
    FillTripMotSelect(listMot_Trips, tripMotsFieldCount);
    tripMotsFieldCount++;
}

function DeleteTripMotEventHandler(e) {
    if (DEBUG) console.log(e);
    $(e.target).off();
    $(HTML_ELEM.tripMotContainer + e.target.value).remove();
}

function ResetTripTabEventHandler() {
    $(HTML_ELEM.inputTripName).val("");
    $(HTML_ELEM.btnDeleteTripMots).each(function (i, elem) {
        $(elem).trigger("click");
    });
    tripMotsFieldCount = 0;
    CreateTripMotEventHandler();
}

function AddTripEventHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    let error = {
        state: false,
        message: []
    };
    let trip = {
        name: $(HTML_ELEM.inputTripName).val(),
        mots: []
    };
    if (trip.name == undefined || trip.name == "") {
        btAlert("Inserisci il nome del Viaggio", ALERT_COL.red);
        return;
    }
    $(HTML_ELEM.selectTripMots).each(function (i, el) {
        let idVal = parseInt(el.value);
        if (!isNaN(idVal)) {
                    //Remove letter M or L
            let kmVal = parseInt($(HTML_ELEM.inputTripMotsKm).eq(i).val());
            if (!isNaN(kmVal) && kmVal > 0) {
                let id_km = [idVal, kmVal];
                trip.mots.push(id_km);
            }
            else {
                error.state = true;
                error.message.push("Inserisci un numero valido nei campi KM");
            }
        }
        else {
            error.state = true;
            error.message.push("Seleziona un mezzo di trasporto dai campi a tendina");
        }
    });
    if (error.state) {
        error.message.forEach(function (value) {
            btAlert(value, ALERT_COL.red);
        });
        return;
    }
    if (DEBUG) console.log(trip);

    let options = { ...AJAX_OPT };
    options.method = "POST";
    options.contentType = "application/json";
    options.url += "Trip-create";
    options.data = JSON.stringify(trip);
    console.log(options);
    WriteQuery(`${QUERIES.addTripName}('${trip.name}')\n${QUERIES.addTripData}${trip.mots.map((val) => { return `(${val})`; })}`, HTML_ELEM.queryTrip);

    // $.ajax(options)
    //     .done(function (data, textStatus, jqXHR) {
    //         let jsonData = JSON.parse(data);
    //         if (jsonData == undefined) { btAlert("Errore nel ricevere la risposta dal server", ALERT_COL.red); return; }
    //         if (DEBUG) console.log(jsonData);

    //         ResetTripTabEventHandler();
    //         FillSelectEventHandler(null);
    //         WriteQuery(`${QUERIES.addTripName}('${trip.name}')\n${QUERIES.addTripData}${trip.mots.map((val) => {return `(${val})`;})}`, HTML_ELEM.queryTrip);
    //         btAlert(jsonData.message, ALERT_COL.gre);
    //     })
    //     .fail(function (jqXHR, textStatus, errorThrown) {
    //         if (DEBUG) console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
    //         let errMsg = JSON.parse(jqXHR.responseText);
    //         if (errMsg == undefined) return;
    //         btAlert(errMsg.message, ALERT_COL.red);
    //     });
}