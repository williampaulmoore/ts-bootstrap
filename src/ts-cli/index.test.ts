import {
    type Config,
    type UserPrompts,
    type UserResponses,
    type PromptUserFor,
    type SetupProject,
    createTscli,
} from "./index";

test("will use the --name command line argument as the name", async () => {
    // arrange
    const args = getArgs([["--name", "project--name"]]);

    // act
    const config = await getConfig(args);

    // assert
    expect(config.name).toBe("project--name");
});

test("will user the -n command line argument as the name", async () => {
    // arrange
    const args = getArgs([["-n", "project-n"]]);

    // act
    const config = await getConfig(args);

    // assert
    expect(config.name).toBe("project-n");
});

test("will prompt the user for the name if the --name command line argument is not supplied", async () => {
    // arrange
    const args = getDefaults(exclude(["--name"], defaultArgs));

    // act
    const prompts = await getUserPrompts(args);

    // assert
    expect(prompts.name).toBe(true);
});

async function getConfig(args: Arg[]): Promise<Config> {
    // arragne
    const [prompt] = usePrompt();
    const [setup, getSetupState] = useSetup();
    const sut = createTscli(prompt, setup);

    // act
    await sut.parseAsync(getArgsv(args));

    return getSetupState().config;
}

async function getUserPrompts(
    args: Arg[],
    responses?: UserResponses,
): Promise<UserPrompts> {
    // arrange
    const [prompt, getPromptState] = usePrompt(responses);
    const [setup] = useSetup();
    const sut = createTscli(prompt, setup);

    // act
    await sut.parseAsync(getArgsv(args));

    return getPromptState().prompts;
}

type Arg = [string, string];
type Args = [string[], string][];

function getDefaults(args: Args): Arg[] {
    return args.map(([flags, value]) => [flags[0], value]);
}
function exclude(exclude_flags: string[], args: Args): Args {
    return (args ?? []).filter(
        ([flags]) => !flags.some((f) => exclude_flags.includes(f)),
    );
}

const defaultArgs: Args = [[["--name", "-n"], "my-project"]];

function getArgs(args: Arg[]): Arg[] {
    const argsFlags = args.map(([flag]) => flag);
    const defaults = exclude(argsFlags, defaultArgs);

    return args.concat(getDefaults(defaults));
}

function toArray(args: Arg[]): string[] {
    return (args ?? []).flatMap(([name, value]) => [name, value]);
}

function getArgsv(args: Arg[]): string[] {
    const processArgs = ["node", "cli-app.js", "tscli"];

    return processArgs.concat(toArray(args));
}

function getPromptResponses(): UserResponses {
    return {
        name: "user-prompt-project",
    };
}

type GetPromptState = () => {
    prompts: UserPrompts;
    responses: UserResponses;
    wasCalled: boolean;
};

function usePrompt(
    userResponses?: UserResponses | undefined,
): [PromptUserFor, GetPromptState] {
    let wasCalled = false;
    let prompts: UserPrompts = {
        name: false,
    };
    const responses: UserResponses = userResponses ?? getPromptResponses();

    return [
        (p: UserPrompts) => {
            prompts = p;
            wasCalled = true;
            return Promise.resolve(responses);
        },
        () => {
            return {
                prompts,
                responses,
                wasCalled,
            };
        },
    ];
}

type GetSetupState = () => {
    config: Config;
    wasCalled: boolean;
};

function useSetup(): [SetupProject, GetSetupState] {
    let wasCalled = false;
    let config: Config = {
        name: null,
    };

    return [
        (c: Config) => {
            config = c;
            wasCalled = true;
        },
        () => {
            return {
                config,
                wasCalled,
            };
        },
    ];
}
