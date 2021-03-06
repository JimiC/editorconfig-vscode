import {
	ExtensionContext,
	DocumentSelector,
	commands,
	languages
} from 'vscode';
import EditorConfigCompletionProvider from './EditorConfigCompletionProvider';
import DocumentWatcher from './DocumentWatcher';
import { generateEditorConfig } from './commands/generateEditorConfig';

/**
 * Main entry
 */
export function activate(ctx: ExtensionContext): void {
	ctx.subscriptions.push(new DocumentWatcher());

	// register .editorconfig file completion provider
	const editorConfigFileSelector: DocumentSelector = {
		language: 'properties',
		pattern: '**/.editorconfig'
	};
	languages.registerCompletionItemProvider(
		editorConfigFileSelector,
		new EditorConfigCompletionProvider()
	);

	// register an internal command used to automatically display IntelliSense
	// when editing a .editorconfig file
	commands.registerCommand(
		'editorconfig._triggerSuggestAfterDelay',
		() => {
			setTimeout(function () {
				commands.executeCommand('editor.action.triggerSuggest');
			}, 100);
		}
	);

	// register a command handler to generate a .editorconfig file
	commands.registerCommand(
		'vscode.generateeditorconfig',
		generateEditorConfig
	);
}
