import ipcMainInvoke from "../ipcInvoke";

const csvStringifySync = ipcMainInvoke('csvStringifySync');
// const csvStringifySync = (input: Parameters<typeof csvStringify>[0]) => new Promise<string>(resolve => csvStringify(
//     input,
//     {
//         header: true,
//         quoted: true,
//     },
//     (err, output) => resolve(output)
// ));

export default csvStringifySync;
