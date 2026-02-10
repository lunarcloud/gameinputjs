#!/usr/bin/env node
/**
 * Pre-build script to prepare the dist directory
 * Removes old dist, copies demo, images, LICENSE and README
 */
import fs from 'fs'

// Remove old dist directory
fs.rmSync('dist', { recursive: true, force: true })

// Copy demo directory
fs.cpSync('demo', 'dist/demo', { recursive: true })

// Copy images to demo
fs.cpSync('img', 'dist/demo/img', { recursive: true })

// Copy LICENSE and README
fs.copyFileSync('LICENSE', 'dist/LICENSE')
fs.copyFileSync('README.md', 'dist/README.md')
