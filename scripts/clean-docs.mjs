#!/usr/bin/env node
/**
 * Clean the docs directory before building documentation
 */
import fs from 'fs'

fs.rmSync('./dist/docs', { recursive: true, force: true })
