import { Command } from "commander";
import inquirer from "inquirer";
import { z } from "zod";
import fsextra from "fs-extra";
const { mkdirSync } = fsextra;

export function tscli(): Command {
    return createTscli(promptUserFor, setupProject);
}

export function createTscli(
    prompt: PromptUserFor,
    setup: SetupProject,
): Command {
    const cmd = new Command("tscli");

    cmd.description("Create a typescript cli project")
        .option("-n, --name <name>", "project name")
        .option("-p, --package-manager <packageManager>", "package manager")
        .action(async (args: CliArgs) => {
            const userPrompts: UserPrompts = {
                name: !args.name,
            };
            const userAnswers = await prompt(userPrompts);
            const config = configSchema.parse({
                name: args.name ?? userAnswers.name,
            });
            setup(config);
        });

    return cmd;
}

interface CliArgs {
    name?: string;
}

export interface UserResponses extends CliArgs {}

const configSchema = z.object({
    name: z.string().min(1),
});
export type Config = z.infer<typeof configSchema>;

/**
 * Create project from the supplied configuration
 *
 */
function setupProject(config: Config) {
    // create project directory
    mkdirSync(config.name);
}
export type SetupProject = typeof setupProject;

export interface UserPrompts {
    name: boolean;
}

/**
 * Promt the user for the requested responses
 *
 */
async function promptUserFor(userPrompts: UserPrompts): Promise<UserResponses> {
    return await inquirer.prompt([
        {
            type: "input",
            name: "name",
            when: () => userPrompts.name,
        },
    ]);
}
export type PromptUserFor = typeof promptUserFor;
