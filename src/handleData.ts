import electronPrompt from 'electron-prompt';
import { stringify, stringifier } from 'csv';

const csvStringifySync = (input?: stringifier.Input) => new Promise<string>(resolve => stringify(
    input!,
    {
        header: true,
        quoted: true,
    },
    (err, output) => resolve(output)
));

const handles = {
    'electronPrompt': electronPrompt,
    'csvStringifySync': csvStringifySync
} as const;

export default handles;
