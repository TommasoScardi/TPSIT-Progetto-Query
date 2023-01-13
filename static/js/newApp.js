const DEBUG = {
    gen: true,
    ajax: false
}
const REQ_URL = "api/";
const HTML_ELEM = {
    selectLeftEl: "#selL",
    selectRigthEl: "#selR",
    columnLeft: "#colL",
    columnRigth: "#colR"
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

let selectedItemsIds = {
    selL: null,
    selR: null,
};

//document onload function
//bind dom with event handler
$(function (e) {
    FillSelectEventHandler(e);

    [$(HTML_ELEM.selectLeftEl), $(HTML_ELEM.selectRigthEl)]
        .forEach(function (val) {
            val.on("change", SelectEventHandler);
        })
});

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

    await res.mots.forEach(async function (val, i, arr) {
        let tempFetchMot = await GetMotData(val.motId);
        arr[i].motData = tempFetchMot;
    });

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

function CreateComparisonColumn(adata) {
    let data = {
        type: element.charAt(0),
        id: parseInt(element.slice(1, element.length)),
        pos: key,
        data: null,
    };

    //TODO: implementare tutto con un ciclo che viene eseguito una volta sola in caso di mot e più in caso di trip

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
}

async function SelectEventHandler(e) {
    let selectedValue = $(e.target).val();

    let oppositeElem = `#${$(e.target).attr("id")}` == HTML_ELEM.selectLeftEl ? HTML_ELEM.selectRigthEl : HTML_ELEM.selectLeftEl;
    $(`${oppositeElem} > *`).attr("disabled", false);

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
                    id: parseInt(element.slice(1, element.length)),
                    pos: key,
                    data: null,
                };
                if (elemData.type == PREFIXS.mot) {
                    elemData.data = await GetMotData(elemData.id);
                }
                else if (elemData.type == PREFIXS.trip) {
                    elemData.data = await GetTripData(elemData.id);
                }
                else {
                    btAlert("Tip del mezzo/viaggio inaspettato", ALERT_COL.red);
                    return;
                }

                if (DEBUG.gen) console.log(elemData);

            }
        }
    }
}