// deno-lint-ignore-file
/** @param {string} data */
const create = async (data) => {
  const res = await fetch("/", { method: "PUT", body: data });
  if (res.status !== 200) {
    throw new Error(await res.text());
  }
  const [uuid, bytes] = (await res.text()).split(" ");
  return [uuid, bytes];
};

/** @param {string} uuid */
const createLink = (uuid) => {
  const link = location.href + uuid;
  const a = document.createElement("a");
  a.href = link;
  a.textContent = link;
  const p = document.createElement("p");
  p.appendChild(a);
  return p;
};

const main = document.querySelector("#main");
let isNew = location.pathname === "/";

require(["vs/editor/editor.main"], () => {
  if (!(main instanceof HTMLElement)) {
    return;
  }
  const editor = monaco.editor.create(main, {
    renderWhitespace: "all",
    theme: "vs-dark",
    wordWrap: "on",
    readOnly: !isNew,
  });
  window.editor = editor;
  document.addEventListener("keydown", async (e) => {
    if (!(e.ctrlKey || e.metaKey)) {
      return;
    }
    if (e.code === "KeyS") {
      if (!isNew) {
        return;
      }
      e.preventDefault();
      const data = editor.getValue();
      try {
        const [uuid, bytes] = await create(data);
        const language =
          /** @type {string} */ (/** @type {any} */ (editor.getModel())
            ?._languageIdentifier?.language);
        location.href = "/" + uuid +
          (language && language !== "plaintext" ? ("." + language) : "");
        return;
      } catch (err) {
        const msg = err.message.startsWith("File already exists: ")
          ? "File already exists at " + location.href +
            err.message.split(" ").pop()
          : err.message;
        editor.setValue(editor.getValue() + "\n// Error: " + msg);
      }
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
    run: (ed) => {
      const lang = prompt("Set language");
      const model = ed.getModel();
      if (!model || !lang) {
        return;
      }
      monaco.editor.setModelLanguage(model, lang);
    },
  });
  if (!isNew) {
    const [file, lang] = location.pathname.split(".");
    if (lang) {
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, lang);
      }
    }
    (async () => {
      editor.setValue("// Loading...");
      const res = await fetch(file);
      const text = await res.text();
      editor.setValue(text);
    })();
  }
});
