// This module will contain logic to detect the tech stack of a project.

import fs from 'fs';
import path from 'path';

/**
 * Detects the tech stack of the current project.
 * @returns {string[]} An array of detected technologies.
 */
export function detectTechStack(): string[] {
  const detectedTech: string[] = [];

  // Check for package.json and specific dependencies
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (dependencies['next']) detectedTech.push('Next.js');
    if (dependencies['react']) detectedTech.push('React');
    if (dependencies['express']) detectedTech.push('Express');
    if (dependencies['typescript']) detectedTech.push('TypeScript');
  }

  // Check for specific files
  if (fs.existsSync(path.resolve(process.cwd(), 'main.go'))) detectedTech.push('Go');
  if (fs.existsSync(path.resolve(process.cwd(), 'requirements.txt'))) detectedTech.push('Python');

  return detectedTech;
}