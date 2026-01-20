import { detectTechStack } from '../../core/detectTechStack';

/**
 * Command to detect the tech stack of the current project.
 */
export function detectCommand() {
  const techStack = detectTechStack();
  if (techStack.length === 0) {
    console.log('No technologies detected.');
  } else {
    console.log('Detected technologies:', techStack.join(', '));
  }
}