const REQ_URL = "http://localhost/Scardi_Tommaso_Query/api/";
const DOM_IDS = {
    selLeft: "#selL",
    selRight: "#selR",
    tripMots: ".trip-mots",
    tripMotsKm: ".trip-mots-km",
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

$(function() {
    getMotNamesList();

    //Event binding
    $(DOM_IDS.selLeft).on("change", getMotsDetails);
    $(DOM_IDS.selRight).on("change", getMotsDetails);
});

function getMotNamesList() {
    let options = {...AJAX_DEF_OPT};
    options.url += "MOT-namesList";

    $.ajax(options)
        .done(function (data, textStatus, jqXHR) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) return;
            console.log(jsonData);
            fillUiSelect(jsonData);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
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
    $(DOM_IDS.tripMots).empty().append($('<option>', {
        text: "Scegli...",
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
        $(DOM_IDS.tripMots).append(
            $("<option>", {
                value: value.id,
                text: value.name,
            })
        );
    });
}

function getMotsDetails(e) {
    selectLR(e);

    const ids = [$(DOM_IDS.selLeft).val(), $(DOM_IDS.selRight).val()];
    if(!isNaN(parseInt(ids[0])) && !isNaN(parseInt(ids[1]))) {
        console.log(getMotDet(ids[0]));
        console.log(getMotDet(ids[1]));
    }
    else
        console.log("select both mot");
}

async function getMotDet(motId) {
    let options = {...AJAX_DEF_OPT};
    options.url = AJAX_DEF_OPT.url + "MOT-mot&id=" + motId;

    $.ajax(options)
        .done(function (data, textStatus, jqXHR) {
            let jsonData = JSON.parse(data);
            if (jsonData == undefined) return undefined;
            return jsonData;
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
            let errMsg = JSON.parse(jqXHR.responseText);
            if (errMsg == undefined) return undefined;
            btAlert(errMsg.message, "danger");
            return errMsg;
        });
}

function selectLR(e) {
    let selId = ("#" + e.target.id) == DOM_IDS.selLeft ? DOM_IDS.selRight : DOM_IDS.selLeft;
    let selVal = e.target.value;

    $(`${selId} > *`).attr("disabled", false);
    $(`${selId} > [value="${selVal}"]`).attr("disabled", true);
}