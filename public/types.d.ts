//eslint-disable-next-line triple-slash-reference
///<reference lib="DOM" />
import type {
  editor,
  KeyMod,
  KeyCode,
  Uri,
} from "../node_modules/monaco-editor/esm/vs/editor/editor.api.d.ts";
declare global {
  const require: (modules: string[], cb: () => void) => void;
  const monaco: {
    KeyMod: typeof KeyMod;
    KeyCode: typeof KeyCode;
    editor: {
      create(
        domElement: HTMLElement,
        options?: editor.IStandaloneEditorConstructionOptions,
        override?: editor.IEditorOverrideServices,
      ): editor.IStandaloneCodeEditor;
      getModel(uri: Uri): editor.ITextModel | null;
      setModelLanguage(model: editor.ITextModel, languageId: string): void;
    };
  };
  interface Window {
    editor: editor.IStandaloneCodeEditor;
  }
}
