let err_msg_box = document.querySelectorAll("#err_msg_box")[0];
let search_btn = document.querySelectorAll("#search_btn")[0];
let definitions_of_h1_title = document.getElementById("definition_of_h1_title");
let main_definitions = document.getElementById("main_definitions");
let append_show_more_button_here = document.querySelectorAll(
  "#append_show_more_button_here"
)[0];
let isRunnedAlready = false;
const get_definitions_main_api = async (word) => {
  let definitions = {};
  let response_status_code = 0;
  await fetch(
    `https://dictionary-by-api-ninjas.p.rapidapi.com/v1/dictionary?word=${word}`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "f90ae6dff2msh8f20787971b5ac3p18078ajsnd2580ae35b70",
        "X-RapidAPI-Host": "dictionary-by-api-ninjas.p.rapidapi.com",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((value) => {
      definitions = value;
      // console.log(value);
    });
  return definitions;
};

const get_definitions_third_api = async (word) => {
  let value_to_return = {};
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "f90ae6dff2msh8f20787971b5ac3p18078ajsnd2580ae35b70",
      "X-RapidAPI-Host": "mashape-community-urban-dictionary.p.rapidapi.com",
    },
  };
  await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    options
  )
    .then((response) => {
      return response.json();
    })
    .then((value) => {
      value_to_return = value;
    });
  // console.log(value_to_return);
  return value_to_return;
};

const get_definitions_second_api = async (word) => {
  let value_to_return = {};
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "f90ae6dff2msh8f20787971b5ac3p18078ajsnd2580ae35b70",
      "X-RapidAPI-Host": "mashape-community-urban-dictionary.p.rapidapi.com",
    },
  };

  await fetch(
    `https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${word}`,
    options
  )
    .then((response) => {
      return response.json();
    })
    .then((value) => {
      value_to_return = value;
    })
    .catch((err) => console.error(err));
  return value_to_return;
};

const showErrorDialogue = () => {
  err_msg_box.setAttribute("class", "alert alert-danger text-center");
  err_msg_box.role = "alert";
  err_msg_box.innerText = `${definition_search_input.value} is not available in this dictionary`;
  setTimeout(() => {
    err_msg_box.removeAttribute("class");
    err_msg_box.removeAttribute("role");
    err_msg_box.innerText = "";
  }, 5000);
};

const onSuccess = (title, definition) => {
  definitions_of_h1_title.innerText = title;
  main_definitions.innerText = definition;
};

const show_message = (definition_title, definition) => {
  onSuccess(`Search result for ${definition_title}`, definition);
};

const show_message_without_title = (message) => {
  main_definitions.innerText = message;
};

const create_show_more = async (where_to_append, text, id) => {
  let created_button = document.createElement("button");
  created_button.type = "button";
  created_button.className = "btn btn-primary text-center";
  created_button.id = id;
  created_button.innerText = text;
  where_to_append.appendChild(created_button);
};

const onShowMoreButtonClick = async (dictionary) => {
  // console.log(dictionary);
  delete dictionary[0];
  for (let i = 1; i < dictionary.length; i++) {
    // console.log(dictionary[i]['definition']);
    let created_p = document.createElement("p");
    created_p.innerText = dictionary[i]["definition"];
    document.body.appendChild(created_p);
  }
};

const onSearchClick = async (event) => {
  event.preventDefault();
  let definition_search_input = document.getElementById(
    "definition_search_input"
  );
  let definitions = await get_definitions_main_api(
    definition_search_input.value
  );
  // console.log(definitions);
  let show_more_button = document.querySelectorAll("#show_more_button")[0];
  let created_p = document.querySelectorAll(".created_p");
  // console.log();
  try {
    show_more_button.remove();
  } catch (err) {
    // console.log(err.name); // TypeError
    // console.log(err.message); // Cannot read properties of undefined (reading 'remove')
  }
  for (let i = 0; i < created_p.length; i++) {
    created_p[i].remove();
  }
  // console.log("removed");
  if (isRunnedAlready == true) {
    let show_more_button = document.querySelectorAll("#show_more_button")[0];
    let created_p = document.querySelectorAll(".created_p");
    // console.log();
    try {
      show_more_button.remove();
    } catch (err) {
      // console.log(err.name); // TypeError
      // console.log(err.message); // Cannot read properties of undefined (reading 'remove')
    }
    for (let i = 0; i < created_p.length; i++) {
      created_p[i].remove();
    }
    // console.log("removed");
  }
  if (definitions.valid == false) {
    let definition_third_api = {}
    // showErrorDialogue()
    let definition_seconds_api = await get_definitions_second_api(
      definition_search_input.value
    );
    await (
      async() => {
        await (
          async() => {
            definition_third_api = await get_definitions_third_api(definition_search_input.value)
            // console.log(definition_third_api.length);
          }
        )()
      }
    )()

    if(definition_third_api.length == 0 || definition_third_api.length == undefined || definition_third_api.length == null){
      // console.log(`If executed`);
      definition_seconds_api = definition_seconds_api.list;
      // console.log(definition_seconds_api);
      if (
        definition_seconds_api.length == 0 ||
        definition_seconds_api.length == undefined ||
        definition_seconds_api.length == null
      ) {
        showErrorDialogue();
      } else {
        // console.log(definition_seconds_api);
        show_message(
          definition_search_input.value,
          definition_seconds_api[0].definition
        );
        let show_more_button = document.querySelectorAll("#show_more_button")[0];
        if (show_more_button == undefined || show_more_button == null) {
          if (definition_seconds_api.length > 1) {
            await create_show_more(
              append_show_more_button_here,
              "Show more",
              "show_more_button"
            );
            let show_more_button =
              document.querySelectorAll("#show_more_button")[0];
            show_more_button.addEventListener("click", () => {
              // console.log(definition_seconds_api);
              delete definition_seconds_api[0];
              for (let i = 1; i < definition_seconds_api.length; i++) {
                // console.log(definition_seconds_api[i]['definition']);
                let created_p = document.createElement("p");
                created_p.className = `created_p text-center`;
                created_p.innerText = `${i}. ${definition_seconds_api[i]["definition"]}`;
                document.body.appendChild(created_p);
              }
              isRunnedAlready = true;
            });
          } else {
            // let show_more_button = document.querySelectorAll("#show_more_button")[0]
            // show_more_button.addEventListener('click', onShowMoreButtonClick(definition_seconds_api))
            // if (definition_seconds_api.length > 1) {
            //   let show_more_button =
            //     document.querySelectorAll("#show_more_button")[0];
            //   show_more_button.addEventListener("click", () => {
            //     console.log(definition_seconds_api);
            //     delete definition_seconds_api[0];
            //     for (let i = 1; i < definition_seconds_api.length; i++) {
            //       // console.log(definition_seconds_api[i]['definition']);
            //       created_p.id = `created_p text-center`;
            //       let created_p = document.createElement("p");
            //       created_p.innerText = `${i}. ${definition_seconds_api[i]["definition"]}`;
            //       document.body.appendChild(created_p);
            //     }
            //     isRunnedAlready = true;
            //   });
            // }
          }
        }
      }
    }
    else{
      let definitions = definition_third_api[0].meanings[0].definitions
      show_message(
        definition_search_input.value,
        definitions[0].definition
      );
      // console.log(definitions);
      let show_more_button = document.querySelectorAll("#show_more_button")[0];
      if (show_more_button == undefined || show_more_button == null) {
        // console.log(definition_third_api[0].meanings[0].definitions.length);
        if (definitions.length > 1) {
          await create_show_more(
            append_show_more_button_here,
            "Show more",
            "show_more_button"
          );
          let show_more_button =
            document.querySelectorAll("#show_more_button")[0];
          show_more_button.addEventListener("click", () => {
            // console.log(definitions);
            delete definitions[0];
            for (let i = 1; i < definitions.length; i++) {
              // console.log(definitions[i]['definition']);
              let created_p = document.createElement("p");
              created_p.className = `created_p text-center`;
              created_p.innerText = `${i}. ${definitions[i]["definition"]}`;
              document.body.appendChild(created_p);
            }
            isRunnedAlready = true;
          });
        } else {
          // let show_more_button = document.querySelectorAll("#show_more_button")[0]
          // show_more_button.addEventListener('click', onShowMoreButtonClick(definitions))
          // if (definitions.length > 1) {
          //   let show_more_button =
          //     document.querySelectorAll("#show_more_button")[0];
          //   show_more_button.addEventListener("click", () => {
          //     console.log(definitions);
          //     delete definitions[0];
          //     for (let i = 1; i < definitions.length; i++) {
          //       // console.log(definitions[i]['definition']);
          //       created_p.id = `created_p text-center`;
          //       let created_p = document.createElement("p");
          //       created_p.innerText = `${i}. ${definitions[i]["definition"]}`;
          //       document.body.appendChild(created_p);
          //     }
          //     isRunnedAlready = true;
          //   });
          // }
        }
      }
    }

  } else {
    show_message(definition_search_input.value, definitions.definition);
  }
};
// get_definitions_second_api('Dhak3453453453dwqda') // Returns array length of 0
function loadGoogleTranslate() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "main_definitions"
  );
}
search_btn.addEventListener("click", onSearchClick);