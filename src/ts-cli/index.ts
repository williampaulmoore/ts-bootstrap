import { Command } from "commander";
import inquirer from "inquirer";
import { z } from "zod";
import fsextra from "fs-extra";
const { mkdirSync } = fsextra;

export function tscli(): Command {
    const cmd = new Command("tscli");

    cmd.description("Create a typescript cli project")
        .option("-n, --name <name>", "project name")
        .action(async (args: CliArgs) => {
            const config = await getProjectConfig(args);
            setupProject(config);
        });

    return cmd;
}

interface CliArgs {
    name?: string;
}

interface UserResponses extends CliArgs {}

const configSchema = z.object({
    name: z.string().min(1),
});
type Config = z.infer<typeof configSchema>;

/**
 *  Get a complete set of the new project config.
 *
 *  @remarks
 *  If there are any missing config from the command line arguments
 *  it will prompt the user to supply an argument
 *
 */
async function getProjectConfig(args: CliArgs): Promise<Config> {
    const userAnswers: UserResponses = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            when: () => !args.name,
        },
    ]);

    return configSchema.parse({
        name: args.name ?? userAnswers.name,
    });
}

/**
 * Create project from the supplied configuration
 *
 */
function setupProject(config: Config) {
    // create project directory
    mkdirSync(config.name);
}
