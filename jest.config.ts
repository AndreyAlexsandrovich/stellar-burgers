import {  JestConfigWithTsJest  } from 'ts-jest';
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config: JestConfigWithTsJest = {
  transform: { 
    '^.+\\.tsx?$': [
            'ts-jest',
            {
             preset: 'ts-jest',
             tsconfig: 'tsconfig.test.json',
            },
          ],
        }
  
};

export default config;
