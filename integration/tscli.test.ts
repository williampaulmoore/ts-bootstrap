import { spawnSync } from "child_process";
import fs from "fs-extra";
const { rmdirSync, pathExistsSync } = fs;

describe("The name property is used to create the project directory", () => {

    test("when specified on the command line", () => {
        const state = exec({
            args: [[nameArg,'my-project']],
        });

        expect(state.exitCode).toBe(0);
        expect(pathExistsSync('./my-project')).toBe(true);
    });

    test("when recieved via user prompt", () => {
        const state = exec({
            prompts: [[nameArg,'my-project']]
        });

        // assert
        expect(state.exitCode).toBe(0);
        expect(pathExistsSync('./my-project')).toBe(true);
    });

});

afterEach(() => {
    const dirName =  getArgValue(invokeState.args,nameArg)
                  ?? getArgValue(invokeState.prompts,nameArg)

    if (dirName && pathExistsSync(`./${dirName}`)) {
        rmdirSync(`./${dirName}`);
    }
});


type Arg = [string,string];

function getArgValue(args: Arg[], argName: string): string {
    const arg = args.find(([name]) => name == argName);

    return arg ? arg[1] : undefined;
}

function substituteArgs(args: Arg[], substitutes: Arg[]): Arg[] {
    if(!substitutes) {
        return args ?? [];
    }

    const substitueNames = getArgsNames(substitutes);
    return (args ?? [])
        .filter(([name]) => !substitueNames.includes(name))
        .concat(substitutes);
}

function removeArgs(args: Arg[], toRemove: string[]): Arg[] {
    toRemove = toRemove ?? [];

    return (args ?? []).filter(([name]) => !toRemove.includes(name));
}

function getArgsNames(args: Arg[]): string[] {
    return (args ?? []).map(([name]) => name);
}


// command arguments
const nameArg = 'name';

const defaultArgs : Arg[] = [
    [nameArg,'test-project'],
];

const flagMap = new Map([
    [nameArg, '-n'],
]);

type InvokeState = {
    args: Arg[],
    prompts: Arg[],
}
const invokeState : InvokeState = {
    args: [],
    prompts: [],
}

function exec(props: { args?: Arg[], prompts?: Arg[]})  {
    const { args, prompts } = props;

    invokeState.args = removeArgs(substituteArgs(defaultArgs,args), getArgsNames(prompts)),
    invokeState.prompts = prompts;

    const cliArgs = ['./run.sh','tscli'].concat(generateCliArgs(invokeState.args));
    const input = generateInputs(invokeState.prompts);

    const process = spawnSync(
        'bash',
        cliArgs,
        {
            shell: true,   // Is a shell script
            stdio: 'pipe', // Capture output from the script
            input: input,
        }
    );

    const exitCode = process.status;
    const stdout = process.stdout.toString();
    return {
        exitCode,
        stdout
    };

    function generateCliArgs(args: Arg[]) : string[] {
        return args.flatMap(([name,value]) => [flagMap.get(name), value]);
    }

    function generateInputs(prompts: Arg[]): string {
        return (prompts ?? []).map(([,value]) => value).join('\n');
    }
}

