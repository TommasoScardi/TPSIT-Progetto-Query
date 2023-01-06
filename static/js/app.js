const REQ_URL = "http://localhost/Scardi_Tommaso_Query/api/";
const DOM_IDS = {
  selLeft: "#selectLeft",
  selRight: "#selectRight",
  formSelect: "#motUsed",
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
    loadUi();
});

function loadUi() {
    let options = AJAX_DEF_OPT;
    options.url += "MOT-namesList";

    $.ajax(options)
        .done(function(data, textStatus, jqXHR){
            let jsonData = JSON.parse(data);
            if(jsonData == undefined)
                return;
            console.log(jsonData);
            fillUiSelect(jsonData);
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR, "\n\n", textStatus, "\n\n", errorThrown);
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
    $(DOM_IDS.formSelect).empty().append($('<option>', {
        text: "",
        selected: true
    }));
    if(dataSelect === undefined) return;
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
        $(DOM_IDS.formSelect).append(
          $("<option>", {
            value: value.id,
            text: value.name,
          })
        );
    });
}