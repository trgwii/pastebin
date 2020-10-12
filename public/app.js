// deno-lint-ignore-file
function create(data, language) {
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

function createLink(uuid) {
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
  if (!(main instanceof HTMLElement)) {
    return;
  }
  var editor = monaco.editor.create(main, {
    renderWhitespace: "all",
    theme: "vs-dark",
    wordWrap: "on",
    readOnly: !isNew,
  });
  window.editor = editor;
  document.addEventListener("keydown", function (e) {
    if (!(e.ctrlKey || e.metaKey)) {
      return;
    }
    if (e.code === "KeyS") {
      if (!isNew) {
        return;
      }
      e.preventDefault();
      var data = editor.getValue();
      var language =
        ((editor.getModel() || {})._languageIdentifier || {}).language;
      create(data, language).then(function (uuidBytes) {
        var uuid = uuidBytes[0];
        var bytes = uuidBytes[1];
        location.href = "/" + uuid +
          (language && language !== "plaintext" ? ("." + language) : "");
        return;
      }).catch(function (err) {
        var msg = err.message.startsWith("File already exists: ")
          ? "File already exists at " + location.href +
            err.message.split(" ").pop()
          : err.message;
        editor.setValue(editor.getValue() + "\n// Error: " + msg);
      });
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
    },
  });
  if (!isNew) {
    var fileLang = location.pathname.split(".");
    var file = fileLang[0];
    var lang = fileLang[1] ||
      document.querySelector('meta[http-equiv="X-Language"]').getAttribute(
        "content",
      );
    if (lang) {
      var model = editor.getModel();
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
  }
});
