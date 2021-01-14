import yaml from 'yaml';
import path from 'path';
import fs from 'fs';

// location of parameter won't change
const parameterFile = path.join(path.resolve(__dirname), '..', '..', '..', 'config', 'parameters.yml');

/**
 * Helper for getting parameters
 */
class Parameter
{
    get(key: string)
    {
        const file: any = fs.readFileSync(parameterFile, 'utf8');
        const parameters: {} = yaml.parse(file);

        return (<any>parameters)[key] || null;
    }
}

export default new Parameter();
