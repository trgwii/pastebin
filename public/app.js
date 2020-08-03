//eslint-disable-next-line triple-slash-reference
///<reference path="types.d.ts" />
/** @param {string} data */
const create = async (data) => {
  const res = await fetch("/", { method: "PUT", body: data });
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
const isNew = location.pathname === "/";

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
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_N,
    function () {
      location.href = "/";
    },
  );
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
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_F,
      function () {
        history.pushState({}, document.title, "/");
        editor.updateOptions({ readOnly: false });
      },
    );
    return;
  }
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
    async function () {
      const data = editor.getValue();
      const [uuid, bytes] = await create(data);
      location.href = "/" + uuid;
    },
  );
});
