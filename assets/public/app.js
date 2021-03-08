///<reference path="./dts/lib.dom.d.ts" />
///<reference path="./dts/lib.monaco.d.ts" />
///<reference path="./dts/lib.deno.d.ts" />
(function () {
  var document = window.document;
  var HTMLElement = window.HTMLElement;
  var localStorage = window.localStorage;
  var history = window.history;
  /** @type {(m: string[], cb: () => void) => void} */
  var require = window.require;

  function getText(/** @type {string} */ url) {
    return fetch(url).then(function (res) {
      return res.text();
    });
  }

  function addLib(
    /** @type {string} */ name,
    /** @type {string} */ url,
    /** @type {monaco.languages.typescript.LanguageServiceDefaults} */ tsDefs,
  ) {
    return getText(url).then(function (text) {
      tsDefs.addExtraLib(text, name);
    });
  }

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
    var tsDefs = monaco.languages.typescript.typescriptDefaults;
    return Promise.all([
      addLib("lib.dom.d.ts", "/js/dts/lib.dom.d.ts", tsDefs),
      addLib("lib.deno.d.ts", "/js/dts/lib.deno.d.ts", tsDefs),
    ])
      .then(function () {
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
