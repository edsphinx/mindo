/**
 * Mindo Global Config Manager
 * Manages ~/.mindo/ directory and global configuration
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const MINDO_HOME = join(process.env.HOME || '', '.mindo');
const CONFIG_PATH = join(MINDO_HOME, 'config.json');
const PROJECTS_PATH = join(MINDO_HOME, 'projects.json');

export interface GlobalConfig {
    version: string;
    turso?: {
        url: string;
        token: string;
    };
    preferences: {
        defaultPort: number;
        autoStart: boolean;
    };
}

export interface ProjectEntry {
    path: string;
    name: string;
    addedAt: string;
}

/**
 * Initialize global Mindo directory
 */
export function initGlobalMindo(): void {
    if (!existsSync(MINDO_HOME)) {
        mkdirSync(MINDO_HOME, { recursive: true });
        mkdirSync(join(MINDO_HOME, 'data'), { recursive: true });
        console.log(`📁 Created ${MINDO_HOME}`);
    }

    if (!existsSync(CONFIG_PATH)) {
        const defaultConfig: GlobalConfig = {
            version: '1.0',
            preferences: {
                defaultPort: 3100,
                autoStart: false,
            },
        };
        writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
    }

    if (!existsSync(PROJECTS_PATH)) {
        writeFileSync(PROJECTS_PATH, JSON.stringify({ projects: [] }, null, 2));
    }
}

/**
 * Get global config
 */
export function getGlobalConfig(): GlobalConfig {
    initGlobalMindo();
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}

/**
 * Save global config
 */
export function saveGlobalConfig(config: GlobalConfig): void {
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

/**
 * Register a project
 */
export function registerProject(projectPath: string, name: string): void {
    initGlobalMindo();
    const data = JSON.parse(readFileSync(PROJECTS_PATH, 'utf-8'));

    // Check if already registered
    const existing = data.projects.find((p: ProjectEntry) => p.path === projectPath);
    if (existing) {
        return; // Already registered
    }

    data.projects.push({
        path: projectPath,
        name,
        addedAt: new Date().toISOString(),
    });

    writeFileSync(PROJECTS_PATH, JSON.stringify(data, null, 2));
}

/**
 * Get all registered projects
 */
export function getProjects(): ProjectEntry[] {
    initGlobalMindo();
    const data = JSON.parse(readFileSync(PROJECTS_PATH, 'utf-8'));
    return data.projects;
}

/**
 * Get Mindo home directory
 */
export function getMindoHome(): string {
    return MINDO_HOME;
}
