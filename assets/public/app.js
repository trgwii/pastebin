///<reference path="./dts/lib.dom.d.ts" />
///<reference path="./dts/lib.monaco.d.ts" />
(function () {
  var document = window.document;
  var HTMLElement = window.HTMLElement;
  var localStorage = window.localStorage;
  var history = window.history;
  /** @type {(m: string[], cb: () => void) => void} */
  var require = window.require;

  function create(/** @type {string} */ data, /** @type {string} */ language) {
    return fetch("/", {
      method: "PUT",
      headers: { "X-Language": language },
      body: data,
    }).then(function (res) {
      return res.text().then(function (text) {
        if (res.status !== 200) {
          throw new Error(text);
        }
        var uuidBytes = text.split(" ");
        var uuid = uuidBytes[0];
        var bytes = uuidBytes[1];
        return [uuid, bytes];
      });
    });
  }

  function createLink(/** @type {string} */ uuid) {
    var link = location.href + uuid;
    var a = document.createElement("a");
    a.href = link;
    a.textContent = link;
    var p = document.createElement("p");
    p.appendChild(a);
    return p;
  }

  var main = document.querySelector("#main");
  var isNew = location.pathname === "/";

  require(["vs/editor/editor.main"], function () {
    var monaco = window.monaco;
    if (!(main instanceof HTMLElement)) {
      return;
    }
    return Promise.all([
      fetch("/js/dts/lib.dom.d.ts").then(function (res) {
        return res.text();
      }),
      fetch("/js/dts/lib.deno.d.ts").then(function (res) {
        return res.text();
      }),
    ])
      .then(function (libs) {
        var dom = libs[0];
        var deno = libs[1];
        window.monaco.languages.typescript.typescriptDefaults.addExtraLib(dom);
        window.monaco.languages.typescript.typescriptDefaults.addExtraLib(deno);
        var editor = monaco.editor.create(main, {
          renderWhitespace: "all",
          theme: "vs-dark",
          wordWrap: "on",
          renderValidationDecorations: "on",
          readOnly: !isNew,
        });
        window.editor = editor;
        document.addEventListener("keydown", function (e) {
          var data, language;
          localStorage.setItem("paste", editor.getValue());
          if (!(e.ctrlKey || e.metaKey)) {
            return;
          }
          if (e.code === "KeyS") {
            if (!isNew) {
              return;
            }
            e.preventDefault();
            data = editor.getValue();
            language =
              ((editor.getModel() || {})._languageIdentifier || {}).language;
            create(data, language).then(function (uuidBytes) {
              var uuid = uuidBytes[0];
              var bytes = uuidBytes[1];
              localStorage.removeItem("paste");
              location.href = "/" + uuid;
              return;
            }).catch(function (/** @type {Error} */ err) {
              var msg = err.message.startsWith("File already exists: ")
                ? "File already exists at " + location.href +
                  err.message.split(" ").pop()
                : err.message;
              editor.setValue(editor.getValue() + "\n// Error: " + msg);
            });
            return;
          }
          if (e.code === "KeyF" && e.shiftKey) {
            if (isNew) {
              return;
            }
            e.preventDefault();
            history.pushState({}, document.title, "/");
            editor.updateOptions({ readOnly: false });
            isNew = true;
            return;
          }
        });
        editor.addAction({
          id: "set-language",
          label: "Set language",
          keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_L,
          ],
          run: function (ed) {
            var lang = prompt("Set language");
            var model = ed.getModel();
            if (!model || !lang) {
              return;
            }
            monaco.editor.setModelLanguage(model, lang);
            localStorage.setItem("language", lang);
          },
        });
        var fileLang, file, lang, model, stored;
        if (!isNew) {
          fileLang = location.pathname.split(".");
          file = fileLang[0];
          lang = fileLang[1] ||
            document.querySelector('meta[http-equiv="X-Language"]')
              .getAttribute(
                "content",
              );
          if (lang) {
            model = editor.getModel();
            if (model) {
              monaco.editor.setModelLanguage(model, lang);
            }
          }
          editor.setValue("// Loading...");
          fetch(file).then(function (res) {
            return res.text();
          }).then(function (text) {
            editor.setValue(text);
          });
        } else {
          stored = localStorage.getItem("paste");
          if (stored) {
            editor.setValue(stored);
          }
          lang = localStorage.getItem("language");
          model = editor.getModel();
          if (lang) {
            if (model) {
              monaco.editor.setModelLanguage(model, lang);
            }
          }
        }
      });
  });
})();
