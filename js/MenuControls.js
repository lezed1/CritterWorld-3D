/*
 *  check if file is invalid -> unneeded
 */

/*
 * BEGIN BUTTON LISTENERS
 */

$(document).ready(function() {
  var active_pane = "";
  var active_tab = "";

  var current_option = "";
  $("#world_menu").hide();
  $("#critter_menu").hide();

  $("#new_world").click(function() {
    $("#world_menu").show();
    active_pane = "world";
    active_tab = "defaults";
  });

  $("#join_world").click(function() {
    joinCurrentWorld();
  });

  joinCurrentWorld = function() {
    $.ajax({
      url : SERVER_URL + "world" + SESSION,
      type : "GET",
      processData : false,
      dataType : 'json'
    }).done(function(data) {
      $("#start_page").hide();
      $("#game_page").show();
      $("#world_menu").hide();
      init_game_server(data);
    });
  }
  newEmptyWorld = function() {
    newWorldHelper("");
  }
  newRandomWorld = function() {
    newWorldHelper(undefined);
  }
  newWorldHelper = function(definition) {
    $.ajax({
      url : SERVER_URL + "world" + SESSION,
      type : "POST",
      data : definition ? {
        definition : ""
      } : undefined,
      processData : false,
      dataType : 'json',
      statusCode : {
        200 : function(response) {
          alert('success! 200 no fn running');
        },
        201 : function(response) {

          joinCurrentWorld();

        },
        400 : function(response) {
          alert('<span style="color:Red;">Error While Saving Outage Entry Please Check</span>', function() {
          });
        },
        404 : function(response) {
          alert('1');
          bootbox.alert('<span style="color:Red;">Server Not Responding</span>', function() {
          });
        },
        500 : function(response) {
          alert('server error');
        }
      }
    });
  }

  // $(document).keydown(function(e) {
    // console.log(e);
    // var code = e.keyCode || e.which;
    // console.log(code);
    // // escape -> close current menu
    // if (code == 27) {
      // active_tab = "";
      // if (active_pane === "world") {
        // $("#world_menu").hide();
      // } else if (active_pane === "critter") {
        // $("#critter_menu").hide();
      // } else {
        // console.log("I don't know what I'm trying to close");
      // }
      // // p -> play simulation
    // } else if (code == 80) {
      // $.post(SERVER_URL + "run?rate=2.0" + SESSION, function() {
        // console.log("running server at 2 turns/sec");
        // getUpdates = setTimeout(function() {
          // alert("Hello")
        // }, 3000);
      // });
// 
      // // s -> step simulation
    // } else if (code == 83) {
      // // $.post(SERVER_URL + "step?count=1", function() {
      // // console.log("stepped 1");
      // // alert("success in step!");
      // // });
// 
      // $.ajax({
        // url : SERVER_URL + "step?count=1" + SESSION,
        // type : "POST",
        // processData : false,
        // dataType : 'json',
        // statusCode : {
          // 200 : function(response) {
            // $.ajax({
              // url : SERVER_URL + "world?update_since=" + world.t + SESSION,
              // type : "GET",
              // processData : false,
              // dataType : 'json',
              // statusCode : {
                // 200 : function(response) {
                  // console.log(response);
                  // world.data.timeStep = response.current_timestep;
                  // world.data.population = response.population;
                  // var updates = response.state;
                  // var update;
                  // for (var i = 0; i < updates.length; i++) {
                    // update = updates[i];
                    // if (update.type === "critter") {
                      // world.critters[update.id].setPosToHex(world.map.hexes[update.col][update.row]);
                    // }
                  // }
                // }
              // }
            // });
          // }
        // }
      // });
// 
      // // h -> halt simulation
    // } else if (code == 72) {
      // clearTimeout(myVar);
      // console.log("halted sim");
    // }
  // });

  $("#world_defaults_button").click(function() {
    if (active_tab !== "defaults") {
      $("#world_defaults_button").addClass("selected");
      $("#world_uploader_button").removeClass("selected");
      active_tab = "defaults";
      $("#world_defaults").show();
      $("#world_uploader").hide();
    }
  });

  $("#world_uploader_button").click(function() {
    if (active_tab !== "uploader") {
      $("#world_uploader_button").addClass("selected");
      $("#world_defaults_button").removeClass("selected");
      active_tab = "uploader";
      $("#world_defaults").hide();
      $("#world_uploader").show();
    }
  });

  $("#world_defaults li div").click(function(e) {
    console.log(e);

    $(e.currentTarget).addClass("selected");
    $(current_option).removeClass("selected");
    current_option = e.currentTarget;
  });

  $("#choose_world").click(function(e) {

    var new_world = current_option.innerText;
    if (new_world === "Empty World") {
      newEmptyWorld();
    } else if (new_world === "Random World") {
      newRandomWorld();
    }

  });

  /*
   * ****************************** BEGIN MENU BAR LISTENERS
   */

  $("#menu-bar-world").click(function() {
    console.log("world clicked");
    
    if (active_pane === "critter") {
      $("#critter_menu").hide();
    }
    
    $("#world_menu").show();
    active_pane = "world";
    

  });

  $("#menu-bar-editor").click(function() {
    $("#critter_menu").show();
     if (active_pane === "world") {
      $("#world_menu").hide();
    }
    active_pane = "critter";
    active_tab = "defaults";
  });

  $("#critter_defaults_button").click(function() {
    if (active_tab !== "defaults") {
      $("#critter_defaults_button").addClass("selected");
      $("#critter_uploader_button").removeClass("selected");
      active_tab = "defaults";
      $("#critter_defaults").show();
      $("#critter_uploader").hide();
    }
  });

  $("#critter_uploader_button").click(function() {
    if (active_tab !== "uploader") {
      $("#critter_uploader_button").addClass("selected");
      $("#critter_defaults_button").removeClass("selected");
      active_tab = "uploader";
      $("#critter_defaults").hide();
      $("#critter_uploader").show();
    }
  });

  $("#critter_defaults li div").click(function(e) {
    console.log(e);

    $(e.currentTarget).addClass("selected");
    $(current_option).removeClass("selected");
    current_option = e.currentTarget;
  });
});

///////////////////////////////////// FILE READING

function readWorldFile(opt_startByte, opt_stopByte) {

  var files = document.getElementById('world_upload').files;
  if (!files.length) {
    alert('Please select a file!');
    return;
  }

  var file = files[0];
  var start = parseInt(opt_startByte) || 0;
  var stop = parseInt(opt_stopByte) || file.size - 1;

  var reader = new FileReader();

  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function(evt) {
    send_data = {
      "definition" : evt.target.result
    };
    console.log(send_data);

    $.ajax({
      url : SERVER_URL + "world" + SESSION,
      type : "POST",
      data : JSON.stringify(send_data),
      processData : false,
      dataType : 'json',
      statusCode : {
        200 : function(response) {
          alert('success!');
        },
        201 : function(response) {
          alert("success!")
        },
        400 : function(response) {
          alert('<span style="color:Red;">Error While Saving Outage Entry Please Check</span>', function() {
          });
        },
        404 : function(response) {
          alert('1');
          bootbox.alert('<span style="color:Red;">Server Not Responding</span>', function() {
          });
        },
        500 : function(response) {
          alert('server error');
        }
      }
    });
    document.getElementById('byte_range').textContent = ['Read bytes: ', start + 1, ' - ', stop + 1, ' of ', file.size, ' byte file'].join('');

  }
  var blob = file.slice(start, stop + 1);
  reader.readAsBinaryString(blob);
}

function readCritterFile(opt_startByte, opt_stopByte) {

  var files = document.getElementById('critter_upload').files;
  if (!files.length) {
    alert('Please select a file!');
    return;
  }

  var file = files[0];
  var start = parseInt(opt_startByte) || 0;
  var stop = parseInt(opt_stopByte) || file.size - 1;

  var reader = new FileReader();

  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function(evt) {

    if (document.getElementById('input_count').value === "") {
      alert("Please give a count and try again", function() {
        return;
      });
    }

    if (evt.target.readyState == FileReader.DONE) {// DONE == 2
      document.getElementById('byte_content').textContent = evt.target.result;
      var prog = (evt.target.result);
      //console.log(prog);

      var myString = prog;
      // var myRegexp = /[a-z]+: ([0-9]+)/g;//[\n]*(.)+");
      var lines = myString.split('\n');
      var mems = [];
      var program = "";
      for (var i in lines) {
        var line = lines[i];
        var match = /[a-z]+: ([0-9]+)/g.exec(line);
        if (match === null) {
          // if null, then we are matching a program
          program += line + '\n';
        } else {
          mems.push(parseInt(match[1]));
        }
      }

      var fu1 = document.getElementById("critter_upload");
      specie_name = (fu1.value.split(/(\\|\/)/g).pop().split(".")[0]);

      // console.log(match);
      // for ( i = 0; i < match.length; i++) {
      // console.log(i + ": " + match[i]);
      // }
      send_data = {
        program : program,
        mem : mems,
        species_id : specie_name,
        num : parseInt(document.getElementById('input_count').value),
      };

      $.ajax({
        url : SERVER_URL + "critters" + SESSION,
        type : "POST",
        data : JSON.stringify(send_data),
        processData : false,
        dataType : 'json',
        statusCode : {
          200 : function(response) {
            if (world.data.timeStep == 0) {
              $.ajax({
                url : SERVER_URL + "world" + SESSION,
                type : "GET",
                processData : false,
                dataType : 'json',
                statusCode : {
                  200 : function(response) {
                    $("#critter_menu").hide();
                    // add critters to the world
                    //world.map.addAll(response.state);
                    world.map.update(response.state);
                  }
                }
              });

            } else if (world.data.timeStep > 0) {
              $.ajax({
                url : SERVER_URL + "world?update_since=" + (world.data.timeStep - 1) + SESSION,
                type : "GET",
                processData : false,
                dataType : 'json',
                statusCode : {
                  200 : function(response) {
                    alert("200 - 413");
                    //world.map.addAll(response.state);
                    world.map.update(response.state);
                  }
                }
              });

            }
          },
          400 : function(response) {
            alert("Please give a count and try again");
          },
          404 : function(response) {
            bootbox.alert('<span style="color:Red;">Server Not Responding</span>', function() {
            });
          },
          500 : function(response) {
            alert('server error');
          }
        }
      });
      document.getElementById('byte_range').textContent = ['Read bytes: ', start + 1, ' - ', stop + 1, ' of ', file.size, ' byte file'].join('');
    }
  };

  var blob = file.slice(start, stop + 1);
  reader.readAsBinaryString(blob);
}

// uploading critters
document.querySelector('.readCritterButtons').addEventListener('click', function(evt) {
  if (evt.target.tagName.toLowerCase() == 'button') {
    var startByte = evt.target.getAttribute('data-startbyte');
    var endByte = evt.target.getAttribute('data-endbyte');
    readCritterFile(startByte, endByte);
  }
}, false);

document.querySelector('.readWorldButtons').addEventListener('click', function(evt) {
  if (evt.target.tagName.toLowerCase() == 'button') {
    var startByte = evt.target.getAttribute('data-startbyte');
    var endByte = evt.target.getAttribute('data-endbyte');
    readWorldFile(startByte, endByte);
  }
}, false);

// $(document).bind('dragover', function (e) {
// var dropZone = $('#drop_zone'),
// timeout = window.dropZoneTimeout;
// if (!timeout) {
// dropZone.addClass('in');
// } else {
// clearTimeout(timeout);
// }
// var found = false,
// node = e.target;
// do {
// if (node === dropZone[0]) {
// found = true;
// break;
// }
// node = node.parentNode;
// } while (node != null);
// if (found) {
// dropZone.addClass('hover');
// } else {
// dropZone.removeClass('hover');
// }
// window.dropZoneTimeout = setTimeout(function () {
// window.dropZoneTimeout = null;
// dropZone.removeClass('in hover');
// }, 100);
// });

/////////////////////////////////////////////
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files;
  // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ', f.size, ' bytes, last modified: ', f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a', '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
  // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('critter_drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
