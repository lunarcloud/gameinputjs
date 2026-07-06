import jsdoc from 'eslint-plugin-jsdoc'
import neostandard from 'neostandard'

const jsdocConfig = jsdoc.configs['flat/recommended']

export default [
    ...neostandard({
        env: ['browser'],
        ignores: [
            '**/*.min.js',
            'coverage/**',
            'dist/**',
            'docs/**',
            'node_modules/**',
            'types/**'
        ]
    }),
    jsdocConfig,
    {
        rules: {
            '@stylistic/indent': ['error', 4, { SwitchCase: 0 }],
            curly: 0,
            'jsdoc/check-types': 0,
            'jsdoc/reject-any-type': 0,
            'jsdoc/reject-function-type': 0
        }
    }
]
