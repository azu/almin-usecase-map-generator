// MIT © 2017 azu
"use strict";
import * as fs from "fs";
import * as path from "path";
import { createNomnoml } from "./create-nomnoml";
export interface generateUseCaseMapConfig {
    defaultActor: string;
    actors: string[];
    matchUseCase?: (fileName: string) => boolean;
    createGroupName?: (fileName: string) => string;
    createUseCaseName?: (fileName: string) => string;
    includes: string[];
    outputPath: string;
    nomnomlHeader?: string;
    format: "nomnoml" | "svg";
}
export function generateUseCaseMap(config: generateUseCaseMapConfig) {
    const nomnomlHeader = `#direction: right
#spacing: 50
#padding: 20`
    const matchUseCase = (filePath: string): boolean => {
        return /UseCase/i.test(filePath);
    }
    const createUseCaseName = (useCaseFilePath: string): string => {
        const basename = path.basename(useCaseFilePath, path.extname(useCaseFilePath));
        return basename
            .replace(new RegExp(config.actors.join("|"), "g"), "")
            .replace(/UseCase$/, "");
    };
    const createGroupName = (useCaseFilePath: string): string => {
        return path.basename(path.dirname(useCaseFilePath));
    }
    const output = createNomnoml({
        nomnomlHeader,
        matchUseCase,
        createGroupName,
        createUseCaseName,
        ...config
    });

    if (config.outputPath) {
        fs.writeFileSync(path.resolve(process.cwd(), config.outputPath), output, "utf-8");
    } else {
        console.log(output);
    }
}
