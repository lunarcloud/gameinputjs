#!/usr/bin/env node
/**
 * Copy source files to dist, excluding test files
 */
import fs from 'fs'

fs.cpSync('src', 'dist', {
    recursive: true,
    filter: (src) => !src.endsWith('.test.js')
})
