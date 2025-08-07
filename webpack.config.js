const path = require('path');
const { readdirSync, accessSync } = require('fs');

module.exports = () => {
    const entry = {};
    const lambdaBase = './src/lambdas/';

    readdirSync(lambdaBase).forEach((directory) => {
        const lambdaTs = `${lambdaBase}${directory}/index.ts`;

        try {
            accessSync(lambdaTs);
            entry[directory] = lambdaTs;
            console.log(`Entry (Typescript): ${entry[directory]}`);
        } catch (e) {
            console.log('Non-lambda directory excluded from entry: ', directory);
        }
    });
    return {
        entry,
        target: 'node',
        ignoreWarnings: [
            /aws-crt/, // Ignore AWS SDK specific warnings (e.g., for AWS CRT)
        ],
        externals: [
            'aws-sdk',
        ],
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.ts$/, // Match TypeScript files
                    use: 'ts-loader', // Use ts-loader to transpile TypeScript
                    exclude: /node_modules/, // Exclude node_modules
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'], // Allow importing both .ts and .js files
        },
        output: {
            filename: '[name]/index.js',
            path: path.resolve(__dirname, 'dist/'),
            libraryTarget: 'commonjs2', // For Lambda compatibility
        },
    };
};
