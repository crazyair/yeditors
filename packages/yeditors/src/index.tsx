import { serialize } from './utils';
import Editor from './YEditor';

type InternalYEditor = typeof Editor;

interface RefYEditor extends InternalYEditor {
  serialize: typeof serialize;
}

const YEditor: RefYEditor = Editor as RefYEditor;

YEditor.serialize = serialize;

export { YEditor };
